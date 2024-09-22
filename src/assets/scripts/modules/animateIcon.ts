import { storageAvailable } from './utils';

const storageKey = 'ami-v2';

if (storageAvailable('session')) {
  const existing = sessionStorage.getItem(storageKey);
  if (existing) {
    document.documentElement.classList.add('no-animate-me-icon');
  } else {
    sessionStorage.setItem(storageKey, '1');
  }
} else {
  document.documentElement.classList.add('no-animate-me-icon');
}
