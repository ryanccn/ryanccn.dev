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

  if (hashOverrideMatch && checkThemeStr(hashOverrideMatch[1])) {
    return hashOverrideMatch[1];
  }

  return null;
};

const getLocalStorageValue = (): ThemeId => {
  let lsv = localStorage.getItem('theme');

  if (!lsv || !checkThemeStr(lsv)) {
    if (DEV)
      console.log(
        `[theme] set localStorage to system (original ${lsv} is invalid)`,
      );

    localStorage.setItem('theme', systemIsDark() ? 'dark' : 'light');
    lsv = systemIsDark() ? 'dark' : 'light';
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

      target.value = newValue;
      updateClass(newValue);
      updateSelect(newValue);
      localStorage.setItem('theme', newValue);

      return true;
    },
  },
);

const updateClass = (value: ThemeId) => {
  if (DEV) console.log(`[theme] updating classes for theme ${value}`);

  for (const oldClass of document.documentElement.classList.values()) {
    if (oldClass.startsWith('theme-')) {
      document.documentElement.classList.remove(oldClass);
    }
  }

  document.documentElement.classList.add(`theme-${value}`);
  document.documentElement.classList.toggle('dark', THEMES[value].dark);

  document.documentElement.style.setProperty(
    'color-scheme',
    THEMES[value].dark ? 'dark' : 'light',
  );
};

const updateSelect = (value: ThemeId) => {
  if (DEV) console.log(`[theme] updating select content for theme ${value}`);

  const select = getThemeSelect();
  if (!select) return;

  select.value = value;
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
