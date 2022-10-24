declare const DEV: boolean;

/* Weird theme system */

type ThemeString = 'dark' | 'light' | 'system';

const BUTTONS = () => document.querySelectorAll('button[data-theme-toggle]');

const storageAvailable = () => {
  const storage = window.localStorage;
  try {
    const x = '__storage_test__';

    storage.setItem(x, x);
    storage.removeItem(x);

    if (DEV) console.log('[theme] storage available');
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
};

const checkThemeStr = (str: string): boolean => {
  return ['dark', 'light', 'system'].indexOf(str) !== -1;
};

/** Switches into the next theme, updating classes along the way */
const nextTheme = () => {
  themeProxy.theme =
    themeProxy.theme === 'system'
      ? 'light'
      : themeProxy.theme === 'light'
      ? 'dark'
      : 'system';
};

const updateClass = () => {
  if (DEV)
    console.log(`[theme] updating classes for theme ${themeProxy.theme}`);

  const systemIsDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  if (
    (themeProxy.theme === 'system' && systemIsDark) ||
    themeProxy.theme === 'dark'
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  document.documentElement.style.setProperty(
    'color-scheme',
    themeProxy.theme === 'system'
      ? systemIsDark
        ? 'dark'
        : 'light'
      : themeProxy.theme
  );
};

const updateHTML = (e: Element) => {
  e.innerHTML =
    themeProxy.theme === 'system'
      ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
      : themeProxy.theme === 'dark'
      ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>';
};

const getLocalStorageValue = () => {
  if (!storageAvailable()) return 'system';

  let lsv = window.localStorage.getItem('theme');

  if (!lsv || !checkThemeStr(lsv)) {
    if (DEV)
      console.log('[theme] set localStorage to system (original is invalid)');
    window.localStorage.setItem('theme', 'system');
    lsv = 'system';
  }

  return lsv as ThemeString;
};

const themeProxy = new Proxy<{ theme: ThemeString }>(
  {
    theme: getLocalStorageValue(),
  },
  {
    set: (target, _, value) => {
      if (typeof value !== 'string') throw new Error('theme must be string!');
      if (!checkThemeStr(value)) throw new Error('invalid theme!');

      target.theme = value as ThemeString;
      if (storageAvailable())
        window.localStorage.setItem('theme', target.theme);

      updateClass();

      BUTTONS().forEach(updateHTML);

      return false;
    },
  }
);

updateClass();

window.addEventListener('load', () => {
  BUTTONS().forEach((e) => {
    updateHTML(e);

    e.addEventListener('click', () => {
      nextTheme();
    });
  });
});

document.addEventListener(
  'load',
  (e) => {
    if (e.target.tagName != 'IMG') {
      return;
    }

    e.target.style.backgroundImage = 'none';
  },
  true
);

window.addEventListener('storage', (e) => {
  if (DEV) console.log('[theme] storage listener triggered');

  if (e.key !== 'theme') return;
  themeProxy.theme = getLocalStorageValue();
});

/* Fonts */

if ('fonts' in document) {
  let satoshiVar = new FontFace(
    'Satoshi',
    "url('/assets/fonts/satoshi/Satoshi-Variable.woff2?v=20221008172130') format('woff2'), url(/assets/fonts/satoshi/Satoshi-Variable.woff?v=20221008172130) format('woff')"
  );

  let interVar = new FontFace(
    'Inter',
    "url('/assets/fonts/inter/Inter-roman.var.woff2?v=20221008172130') format('woff2')"
  );

  Promise.all([satoshiVar.load(), interVar.load()]).then((fonts) => {
    fonts.forEach((font) => document.fonts.add(font));
  });
}

// Edit on GitHub
(() => {
  if (!document.currentScript) return;
  const inputPath = document.currentScript.getAttribute('data-input-path');
  if (!inputPath) return;

  window.addEventListener('keydown', (ev) => {
    if (ev.key === '.') {
      location.href =
        'https://github.com/ryanccn/ryanccn.dev/blob/main/' + inputPath;
    }
  });
})();
