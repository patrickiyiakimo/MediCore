export const setItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage may be unavailable; ignore
  }
};

export const getItem = (key) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const removeItem = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // storage may be unavailable; ignore
  }
};