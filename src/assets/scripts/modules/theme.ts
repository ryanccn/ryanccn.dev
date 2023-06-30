const THEME_SWITCHER = () =>
  document.querySelector('[data-theme-select] > select') as HTMLSelectElement;

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
  'rose-pine': { name: 'Rosé Pine', dark: true },
  'rose-pine-moon': { name: 'Rosé Pine Moon', dark: true },
  'rose-pine-dawn': { name: 'Rosé Pine Dawn', dark: false },
};

const checkThemeStr = (str: string): boolean => {
  return Object.keys(THEMES).indexOf(str) !== -1;
};

const systemIsDark = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const getHashOverride = () => {
  if (location.hash.includes('theme=')) {
    const hashOverrideMatch = location.hash.match(/theme=([a-z\-]+)/);
    if (hashOverrideMatch) {
      themeHasOverride.value = true;
      return hashOverrideMatch[1];
    }
  }

  themeHasOverride.value = false;
  return null;
};

let themeHasOverride = { value: false };

const getLocalStorageValue = () => {
  if (!storageAvailable()) return systemIsDark() ? 'dark' : 'light';

  let lsv = window.localStorage.getItem('theme');

  if (!lsv || !checkThemeStr(lsv)) {
    if (DEV)
      console.log('[theme] set localStorage to system (original is invalid)');

    window.localStorage.setItem('theme', systemIsDark() ? 'dark' : 'light');
    lsv = systemIsDark() ? 'dark' : 'light';
  }

  const hashOverride = getHashOverride();
  if (hashOverride && checkThemeStr(hashOverride)) return hashOverride;

  return lsv;
};

let theme = getLocalStorageValue();

const updateClass = () => {
  if (DEV) console.log(`[theme] updating classes for theme ${theme}`);

  for (const oldClass of document.documentElement.classList.values()) {
    if (oldClass.startsWith('theme-'))
      document.documentElement.classList.remove(oldClass);
  }

  document.documentElement.classList.add(`theme-${theme}`);
  document.documentElement.classList.toggle('dark', THEMES[theme].dark);

  document.documentElement.style.setProperty(
    'color-scheme',
    THEMES[theme].dark ? 'dark' : 'light'
  );
};

const updateSelect = () => {
  document.querySelector('[data-theme-select] > span')!.innerHTML =
    THEMES[theme].name + (themeHasOverride.value ? ' (override)' : '');

  if (themeHasOverride.value) THEME_SWITCHER().setAttribute('disabled', '1');
};

updateClass();

window.addEventListener('DOMContentLoaded', () => {
  const themeSwitcherElem = THEME_SWITCHER();
  updateSelect();
  themeSwitcherElem.value = theme;

  themeSwitcherElem.addEventListener('change', () => {
    theme = themeSwitcherElem.value;
    updateClass();
    updateSelect();

    if (storageAvailable()) window.localStorage.setItem('theme', theme);
  });
});

window.addEventListener('storage', (e) => {
  if (DEV) console.log('[theme] storage listener triggered');

  if (e.key !== 'theme') return;

  theme = getLocalStorageValue();
  updateClass();
  updateSelect();
});

window.addEventListener('hashchange', () => {
  if (DEV) console.log('[theme] hashchange listener triggered');

  const newOverride = getHashOverride();
  if (newOverride && checkThemeStr(newOverride)) {
    theme = newOverride;
    updateClass();
    updateSelect();
  }
});
