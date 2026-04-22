/**
 * @template T
 * @param {string} value
 * @param {T} fallback
 * @returns {T}
 */
export function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * @param {string} key
 * @returns {string}
 */
export function safeLocalStorageGet(key) {
  try {
    return window.localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

/**
 * @param {string} key
 * @param {string} value
 */
export function safeLocalStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

/**
 * @param {string} key
 */
export function safeLocalStorageRemove(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

