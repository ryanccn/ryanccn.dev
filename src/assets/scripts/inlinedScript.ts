declare const DEV: boolean;

/* Weird theme system */

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

const THEMES: { [id: string]: { name: string; dark: boolean } } = {
  light: { name: 'Default Light', dark: false },
  dark: { name: 'Default Dark', dark: true },
  'ctp-latte': { name: 'Catppuccin Latte', dark: false },
  'ctp-frappe': { name: 'Catppuccin Frappé', dark: true },
  'ctp-macchiato': { name: 'Catppuccin Macchiato', dark: true },
  'ctp-mocha': { name: 'Catppuccin Mocha', dark: true },
  'nord-light': { name: 'Nord Light', dark: false },
  'nord-dark': { name: 'Nord Dark', dark: true },
  hack: { name: 'Hack', dark: true },
};

const checkThemeStr = (str: string): boolean => {
  return Object.keys(THEMES).indexOf(str) !== -1;
};

const systemIsDark = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const getLocalStorageValue = () => {
  if (!storageAvailable()) return systemIsDark() ? 'dark' : 'light';

  let lsv = window.localStorage.getItem('theme');

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
const nextTheme = () => {
  const themeList = Object.keys(THEMES);

  const prevTheme = theme;
  theme = themeList[(themeList.indexOf(theme) + 1) % themeList.length];

  updateClass(prevTheme, theme);
  BUTTONS().forEach(updateHTML);

  if (storageAvailable()) window.localStorage.setItem('theme', theme);
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

const updateHTML = (e: Element) => {
  e.querySelector('span')!.innerHTML = THEMES[theme].name;
};

updateClass(null, theme);

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
    // @ts-expect-error bah
    if (!e.target || e.target.tagName != 'IMG') {
      return;
    }

    // @ts-expect-error humbug
    e.target.style.backgroundImage = 'none';
  },
  true
);

window.addEventListener('storage', (e) => {
  if (DEV) console.log('[theme] storage listener triggered');

  if (e.key !== 'theme') return;
  theme = getLocalStorageValue();
});

/* Fonts */

if ('fonts' in document) {
  let satoshiVar = new FontFace(
    'Satoshi',
    "url('/assets/fonts/satoshi/Satoshi-Variable.woff2?v=20221229') format('woff2'), url('/assets/fonts/satoshi/Satoshi-Variable.woff?v=20221229') format('woff')"
  );

  let satoshiVarItalic = new FontFace(
    'Satoshi',
    "url('/assets/fonts/satoshi/Satoshi-VariableItalic.woff2?v=20221229') format('woff2'), url('/assets/fonts/satoshi/Satoshi-VariableItalic.woff?v=20221229') format('woff')",
    { style: 'italic' }
  );

  let plexVar = new FontFace(
    'IBM Plex Sans',
    "url('/assets/fonts/plex/IBMPlexSansVar-Roman.woff2?v=20221229') format('woff2'), url('/assets/fonts/plex/IBMPlexSansVar-Roman.woff?v=20221229') format('woff')"
  );

  let plexVarItalic = new FontFace(
    'IBM Plex Sans',
    "url('/assets/fonts/plex/IBMPlexSansVar-Italic.woff2?v=20221229') format('woff2'), url('/assets/fonts/plex/IBMPlexSansVar-Italic.woff?v=20221229') format('woff')",
    { style: 'italic' }
  );

  Promise.all([
    satoshiVar.load(),
    satoshiVarItalic.load(),
    plexVar.load(),
    plexVarItalic.load(),
  ]).then((fonts) => {
    fonts.forEach((font) => document.fonts.add(font));
  });
}
