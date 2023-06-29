declare const DEV: boolean;

/* Weird theme system */

const THEME_SWITCHER = () =>
  document.querySelector('[data-theme-toggle] > select') as HTMLSelectElement;

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

const THEMES: { [id: string]: { name: string; dark: boolean } } = {
  light: { name: 'Default Light', dark: false },
  dark: { name: 'Default Dark', dark: true },
  'ctp-latte': { name: 'Catppuccin Latte', dark: false },
  'ctp-frappe': { name: 'Catppuccin Frappé', dark: true },
  'ctp-macchiato': { name: 'Catppuccin Macchiato', dark: true },
  'ctp-mocha': { name: 'Catppuccin Mocha', dark: true },
  'nord-light': { name: 'Nord Light', dark: false },
  'nord-dark': { name: 'Nord Dark', dark: true },
  'pink-light': { name: 'Pink Light', dark: false },
  'pink-dark': { name: 'Pink Dark', dark: true },
};

const checkThemeStr = (str: string): boolean => {
  return Object.keys(THEMES).indexOf(str) !== -1;
};

const systemIsDark = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

let themeHasOverride = { value: false };

const getLocalStorageValue = () => {
  if (!storageAvailable()) return systemIsDark() ? 'dark' : 'light';

  let lsv = window.localStorage.getItem('theme');

  if (location.hash.includes('theme=')) {
    const hashOverrideMatch = location.hash.match(/theme=([a-z\-]+)/);
    if (hashOverrideMatch) {
      lsv = hashOverrideMatch[1];
      themeHasOverride.value = true;
    }
  }

  if (!lsv || !checkThemeStr(lsv)) {
    if (DEV)
      console.log('[theme] set localStorage to system (original is invalid)');

    window.localStorage.setItem('theme', systemIsDark() ? 'dark' : 'light');
    lsv = systemIsDark() ? 'dark' : 'light';
  }

  return lsv;
};

let theme = getLocalStorageValue();

/** Switches into the next theme, updating classes along the way */
const switchTheme = (newTheme: string) => {
  const prevTheme = theme;

  updateClass(prevTheme, newTheme);
  updateHTML(newTheme);

  theme = newTheme;

  if (storageAvailable()) window.localStorage.setItem('theme', newTheme);
};

const updateClass = (prev: string | null, curr: string) => {
  if (DEV) console.log(`[theme] updating classes for theme ${theme}`);

  if (prev) {
    document.documentElement.classList.remove(`theme-${prev}`);
    if (THEMES[prev].dark) document.documentElement.classList.remove(`dark`);
  }

  document.documentElement.classList.add(`theme-${curr}`);
  if (THEMES[curr].dark) document.documentElement.classList.add(`dark`);

  document.documentElement.style.setProperty(
    'color-scheme',
    THEMES[curr].dark ? 'dark' : 'light'
  );
};

const updateHTML = (theme: string) => {
  document.querySelector('[data-theme-toggle] > span')!.innerHTML =
    THEMES[theme].name;
  if (themeHasOverride.value) THEME_SWITCHER().setAttribute('disabled', '1');
};

updateClass(null, theme);

window.addEventListener('DOMContentLoaded', () => {
  updateHTML(theme);
  THEME_SWITCHER().value = theme;

  THEME_SWITCHER().addEventListener('change', (e) => {
    switchTheme(THEME_SWITCHER().value);
  });
});

window.addEventListener('storage', (e) => {
  if (DEV) console.log('[theme] storage listener triggered');

  if (e.key !== 'theme') return;
  theme = getLocalStorageValue();

  updateClass(null, theme);
  updateHTML(theme);
});

/* Share button */

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button[data-share-btn]').forEach((elem) => {
    if ('share' in navigator)
      (elem as HTMLButtonElement).classList.remove('hidden');

    elem.addEventListener('click', () => {
      navigator.share({
        title: document.querySelector('title')!.innerText,
        url: location.href,
      });
    });
  });
});

/* LQIP hider */

document.addEventListener(
  'load',
  (e) => {
    // @ts-expect-error bah
    if (!e.target || e.target.tagName != 'IMG') {
      return;
    }

    // @ts-expect-error humbug
    e.target.style.backgroundImage = 'none';
  },
  true
);
