const getThemeSelect = () =>
  document.querySelector<HTMLSelectElement>('[data-theme-select] > select');

const THEMES = {
  'light': { name: 'Default Light', dark: false },
  'dark': { name: 'Default Dark', dark: true },
  'ctp-latte': { name: 'Catppuccin Latte', dark: false },
  'ctp-frappe': { name: 'Catppuccin Frappé', dark: true },
  'ctp-macchiato': { name: 'Catppuccin Macchiato', dark: true },
  'ctp-mocha': { name: 'Catppuccin Mocha', dark: true },
  'nord-light': { name: 'Nord Light', dark: false },
  'nord-dark': { name: 'Nord Dark', dark: true },
  'pink-light': { name: 'Pink Light', dark: false },
  'pink-dark': { name: 'Pink Dark', dark: true },
  'rose-pine': { name: 'Rosé Pine', dark: true },
  'rose-pine-moon': { name: 'Rosé Pine Moon', dark: true },
  'rose-pine-dawn': { name: 'Rosé Pine Dawn', dark: false },
} as const satisfies { [id: string]: { name: string; dark: boolean } };

type ThemeId = keyof typeof THEMES;

const checkThemeStr = (str: string | undefined): str is ThemeId => {
  return str !== undefined && Object.keys(THEMES).indexOf(str) !== -1;
};

const systemIsDark = () => {
  return matchMedia('(prefers-color-scheme: dark)').matches;
};

const getHashOverride = () => {
  const hashOverrideMatch = location.hash.match(/theme=([a-z-]+)/);
  if (hashOverrideMatch) {
    themeHasOverride.value = true;
    return hashOverrideMatch[1];
  }

  themeHasOverride.value = false;
  return null;
};

const themeHasOverride = { value: false };

const getLocalStorageValue = () => {
  let lsv = localStorage.getItem('theme');

  if (!lsv || !checkThemeStr(lsv)) {
    if (DEV) {
      console.log('[theme] set localStorage to system (original is invalid)');
    }

    localStorage.setItem('theme', systemIsDark() ? 'dark' : 'light');
    lsv = systemIsDark() ? 'dark' : 'light';
  }

  const hashOverride = getHashOverride();
  if (hashOverride && checkThemeStr(hashOverride)) return hashOverride;

  if (!checkThemeStr(lsv)) {
    throw new Error(`Theme "${lsv}" is invalid despite checks`);
  }

  return lsv;
};

let theme = getLocalStorageValue();

const updateClass = () => {
  if (!checkThemeStr(theme)) return;
  if (DEV) console.log(`[theme] updating classes for theme ${theme}`);

  for (const oldClass of document.documentElement.classList.values()) {
    if (oldClass.startsWith('theme-')) {
      document.documentElement.classList.remove(oldClass);
    }
  }

  document.documentElement.classList.add(`theme-${theme}`);
  document.documentElement.classList.toggle('dark', THEMES[theme].dark);

  document.documentElement.style.setProperty(
    'color-scheme',
    THEMES[theme].dark ? 'dark' : 'light',
  );
};

const updateFauxSelect = () => {
  if (!checkThemeStr(theme)) return;
  if (DEV)
    console.log(`[theme] updating faux select content for theme ${theme}`);

  const textElem = document.querySelector('[data-theme-select] > span');

  if (textElem) {
    textElem.innerHTML =
      THEMES[theme].name + (themeHasOverride.value ? ' (override)' : '');
  }

  if (themeHasOverride.value) getThemeSelect()?.setAttribute('disabled', '1');
};

const updateSelect = () => {
  if (!checkThemeStr(theme)) return;
  if (DEV) console.log(`[theme] updating select content for theme ${theme}`);

  const select = getThemeSelect();
  if (!select) return;

  select.value = theme;
};

updateClass();

addEventListener('DOMContentLoaded', () => {
  const themeSwitcherElem = getThemeSelect();
  updateFauxSelect();
  updateSelect();

  if (themeSwitcherElem) {
    themeSwitcherElem.addEventListener('change', () => {
      if (!checkThemeStr(themeSwitcherElem.value)) return;

      theme = themeSwitcherElem.value;

      updateClass();
      updateFauxSelect();
      localStorage.setItem('theme', theme);
    });
  }
});

addEventListener('storage', (e) => {
  if (DEV) console.log('[theme] storage listener triggered');

  if (e.key !== 'theme') return;

  theme = getLocalStorageValue();
  updateClass();
  updateSelect();
  updateFauxSelect();
});

addEventListener('pageshow', (event) => {
  if (event.persisted) {
    if (DEV) console.log('[theme] pageshow listener triggered');

    theme = getLocalStorageValue();
    updateClass();
    updateSelect();
    updateFauxSelect();
  }
});

addEventListener('hashchange', () => {
  if (DEV) console.log('[theme] hashchange listener triggered');

  const newOverride = getHashOverride();
  if (newOverride && checkThemeStr(newOverride)) {
    theme = newOverride;

    updateClass();
    updateSelect();
    updateFauxSelect();
  }
});
