import { storageAvailable } from './utils';

const getThemeSelect = () => document.querySelector<HTMLSelectElement>('#theme-select > select');

const isThemeDark = {
  'light': false,
  'dim': true,
  'dark': true,
  'ctp-latte': false,
  'ctp-frappe': true,
  'ctp-macchiato': true,
  'ctp-mocha': true,
  'nord-light': false,
  'nord-dark': true,
  'rose-pine': true,
  'rose-pine-moon': true,
  'rose-pine-dawn': false,
  'flexoki-light': false,
  'flexoki-dark': true,
  'gruvbox-light': false,
  'gruvbox-dark': true,
} satisfies Record<string, boolean>;

type ThemeId = keyof typeof isThemeDark;

const checkThemeStr = (str: unknown): str is ThemeId => {
  return typeof str === 'string' && Object.keys(isThemeDark).includes(str);
};

const systemIsDark = () => {
  return matchMedia('(prefers-color-scheme: dark)').matches;
};

const getHashOverride = () => {
  const hashOverrideMatch = location.hash.match(/theme=([a-z-]+)/);

  if (hashOverrideMatch && checkThemeStr(hashOverrideMatch[1])) {
    return hashOverrideMatch[1];
  }

  return null;
};

const getLocalStorageValue = (): ThemeId => {
  const defaultTheme: ThemeId = systemIsDark() ? 'dark' : 'light';

  if (!storageAvailable('local')) {
    return defaultTheme;
  }

  let lsv = localStorage.getItem('theme');

  if (!checkThemeStr(lsv)) {
    if (DEV) console.log(`[theme] set localStorage to system (original ${lsv} is invalid)`);

    localStorage.setItem('theme', defaultTheme);
    lsv = defaultTheme;
  }

  const hashOverride = getHashOverride();
  if (hashOverride) return hashOverride;

  return lsv as ThemeId;
};

const theme = new Proxy(
  { value: getLocalStorageValue() },
  {
    set(target, p, newValue) {
      if (p !== 'value') return false;
      if (!checkThemeStr(newValue)) return false;
      if (target.value === newValue) return true;

      target.value = newValue;

      if ('startViewTransition' in document) {
        document.startViewTransition(() => {
          updateClass(newValue);
          updateSelect(newValue);
        });
      } else {
        updateClass(newValue);
        updateSelect(newValue);
      }

      if (storageAvailable('local')) {
        localStorage.setItem('theme', newValue);
      }

      return true;
    },
  },
);

const updateClass = (value: ThemeId) => {
  if (DEV) console.log(`[theme] updating classes for theme ${value}`);
  const { documentElement } = document;

  for (const oldClass of documentElement.classList.values()) {
    if (oldClass.startsWith('theme-')) {
      documentElement.classList.remove(oldClass);
    }
  }

  documentElement.classList.add(`theme-${value}`);
  documentElement.classList.toggle('dark', isThemeDark[value]);

  documentElement.style.setProperty('color-scheme', isThemeDark[value] ? 'dark' : 'light');
};

const updateSelect = (value: ThemeId) => {
  if (DEV) console.log(`[theme] updating select content for theme ${value}`);

  const select = getThemeSelect();
  if (!select) return;

  if (select.value !== value) select.value = value;
};

updateClass(theme.value);

addEventListener('DOMContentLoaded', () => {
  const themeSwitcherElem = getThemeSelect();
  updateSelect(theme.value);

  if (themeSwitcherElem) {
    themeSwitcherElem.addEventListener('change', () => {
      if (!checkThemeStr(themeSwitcherElem.value)) return;
      theme.value = themeSwitcherElem.value;
    });
  }
});

addEventListener('storage', (e) => {
  if (DEV) console.log('[theme] storage listener triggered');

  if (e.key !== 'theme') return;
  theme.value = getLocalStorageValue();
});

addEventListener('pageshow', (event) => {
  if (event.persisted) {
    if (DEV) console.log('[theme] pageshow listener triggered');

    theme.value = getLocalStorageValue();
  }
});

addEventListener('hashchange', () => {
  if (DEV) console.log('[theme] hashchange listener triggered');

  const newOverride = getHashOverride();
  if (newOverride) theme.value = newOverride;
});
