/** @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#testing_for_availability */
export const storageAvailable = (type: 'local' | 'session') => {
  try {
    const storage = window[`${type}Storage`];

    const x = '__storage_test';
    storage.setItem(x, x);
    storage.removeItem(x);

    if (DEV) console.log(`[storageAvailable] ${type} check successful`);
    return true;
  } catch {
    if (DEV) console.log(`[storageAvailable] ${type} check failed`);
    return false;
  }
};
