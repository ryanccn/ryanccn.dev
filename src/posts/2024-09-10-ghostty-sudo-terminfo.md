---
title: Where Did My Colorful Home Manager Logs Go? Debugging Ghostty and Sudo
tags:
  - nix
  - scripting
  - terminal
date: 2024-09-10
---

Ever since switching to [Ghostty](https://mitchellh.com/ghostty), my Home Manager activation has stopped printing its headers as cyan and bold. I never bothered enough to fix it, since I work on my flake most of the time in VS Code, but since I happened to be working on [morlana](https://github.com/ryanccn/morlana), an alternative implementation for `darwin-{rebuild,installer,uninstaller}`, and was getting acquainted with some of the internals of how a nix-darwin system is activated, I decided to take a look at what _exactly_ was causing the missing colors.

My initial hypothesis, the one that I had from my first encounter with this problem, was that Home Manager had some sort of registry of `TERM` variables to check color support, and this registry included `xterm-256color` but not `xterm-ghostty`. I dived into the Home Manager codebase in search of evidence for this hypothesis, but searches for `TERM` and `xterm` came up with results unrelated to the activation logging. Huh, I thought. So where exactly _was_ whether to print colored output determined?

```bash
# https://github.com/nix-community/home-manager/blob/8a175a89137fe798b33c476d4dae17dba5fb3fd3/lib/bash/home-manager.sh#L22-L34

# Enable colors for terminals, and allow opting out.
if [[ ! -v NO_COLOR && -t 1 ]]; then
	# See if it supports colors.
	local ncolors
	ncolors=$(tput colors 2> /dev/null || echo 0)

	if [[ -n "$ncolors" && "$ncolors" -ge 8 ]]; then
		normalColor="$(tput sgr0)"
		errorColor="$(tput bold)$(tput setaf 1)"
		warnColor="$(tput setaf 3)"
		noteColor="$(tput bold)$(tput setaf 6)"
	fi
fi
```

This was pretty straightforward. The [tput](https://linux.die.net/man/1/tput) utility reads from terminfo databases to print information about terminal capabilities and features, such as ANSI colors. Here, as [terminfo(5)](https://linux.die.net/man/5/terminfo) helpfully tells us,

> The numeric capabilities **colors** and **pairs** specify the maximum numbers of colors and color-pairs that can be displayed simultaneously.

I ran `tput colors` in Ghostty to test if it returned a valid value.

```console
$ tput colors
256
```

It did! I also tried testing the if condition in bash, and the result was the same. It was a TTY, `NO_COLOR` wasn't set, and it supported a 256-color lookup table. So what on Earth was causing disabled colors in logging?

All of a sudden, it occurred to me. From my time spent writing morlana, I knew that the activate step in `darwin-rebuild switch` or `morlana switch` used sudo to execute the activate script with elevated privileges.

```bash
# https://github.com/LnL7/nix-darwin/blob/76559183801030451e200c90a1627c1d82bb4910/pkgs/nix-tools/darwin-rebuild.sh#L247-L251

if [ "$USER" != root ]; then
	sudo "$systemConfig/activate"
else
	"$systemConfig/activate"
fi
```

```rust
// https://github.com/ryanccn/morlana/blob/a3cabed7e0824b0fda55652628c102ab7a108c2f/src/stages/activate.rs#L23-L34

pub fn activate(out: &Path) -> Result<()> {
    if !util::sudo_cmd(out.join("activate"))
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .status()?
        .success()
    {
        bail!("failed to activate");
    }


    Ok(())
}
```

Was it possible that sudo was somehow interfering with the colors to make them not work? To validate this hypothesis, I tried running `sudo tput colors`.

```console
$ sudo tput colors
tput: unknown terminal "xterm-ghostty"
```

Sudo _was_ causing the issues, and now I also know why: commands that are running inside sudo do not recognize `xterm-ghostty`, because they don't have access to the Ghostty terminfo!

In a misguided effort to rectify this problem, I enabled the `sudo` wrapping feature in Ghostty's shell integration, which preserves Ghostty terminfo. Now `sudo tput colors` printed `256` as well! But Home Manager still did not print colored logs. As it turns out, what should've been obvious to me in the first place was that shell integration was modifying the shell and creating a wrapper function in the shell, while the `sudo` that `activate` was running under was the executable, not the function.

So, I looked into Ghostty's source to find out what the shell integration was doing in order to figure out how to make this work for sudo anywhere.

```fish
# https://github.com/ghostty-org/ghostty/blob/12bf107bcbac28202c5fab828416e8aa43b1b798/src/shell-integration/fish/vendor_conf.d/ghostty-shell-integration.fish#L74-L93

# Wrap `sudo` command to ensure Ghostty terminfo is preserved
function sudo -d "Wrap sudo to preserve terminfo"
	set --local sudo_has_sudoedit_flags "no"
	for arg in $argv
		# Check if argument is '-e' or '--edit' (sudoedit flags)
		if string match -q -- "-e" "$arg"; or string match -q -- "--edit" "$arg"
			set --local sudo_has_sudoedit_flags "yes"
			break
		end
		# Check if argument is neither an option nor a key-value pair
		if not string match -r -q -- "^-" "$arg"; and not string match -r -q -- "=" "$arg"
			break
		end
	end
	if test "$sudo_has_sudoedit_flags" = "yes"
		command sudo $argv
	else
		command sudo TERMINFO="$TERMINFO" $argv
	end
end
```

As it turns out, it's very simple! It just keeps the `TERMINFO` environment variable in the sudo invocation. Referring again to [terminfo(5)](https://linux.die.net/man/5/terminfo),

> If the environment variable TERMINFO is set, it is interpreted as the pathname of a directory containing the compiled description you are working on. Only that directory is searched.

So, keeping the `TERMINFO` variable (which Ghostty sets) in sudo should suffice to make colors work again in Home Manager. Since `sudo` on macOS defaults to resetting the environment with `env_reset`, we need to add a default to `/etc/sudoers` that keeps the `TERMINFO` environment variable. And accomplishing this is as simple as

```
Defaults    env_keep += "TERMINFO"
```

I added this magic line of configuration to `/etc/sudoers.d/env-keep-terminfo` (since files from `/etc/sudoers.d` are included by default in the config), and tried switching to the configuration again. Home Manager's logs had become cyan and bold, as they are meant to be.

After writing to this file, I naturally became wracked with guilt over writing it into a file imperatively rather than including this fix as part of my declarative nix-darwin configuration. After a quick search in the nix-darwin reference, I was relieved to see that nix-darwin provided an option for providing extra configuration to sudo: [`security.sudo.extraConfig`](https://daiderd.com/nix-darwin/manual/index.html#opt-security.sudo.extraConfig). (It writes to `/etc/sudoers.d/10-nix-darwin-extra-config`.)

```nix
{
  security.sudo.extraConfig = ''
    Defaults    env_keep += "TERMINFO"
  '';
}
```

And with that, all of my problems were solved. This was a problem that had been bugging me for a very long time, and I was glad that with a little under an hour's work, I had managed to come up with a clean fix for it. Hopefully, you who are reading this have found this article modestly helpful as well; cheers!
