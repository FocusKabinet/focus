export const loadState = (key) => {
  let serializedState;
  try {
    serializedState = JSON.parse(window.localStorage.getItem(key));
  } catch (e) {
    console.warn(`failed to load '${key}' localStorage state`);
  }

  return serializedState;
};

export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    window.localStorage.setItem(key, serializedState);
  } catch {
    console.warn('localStorage:', 'failed to save state');
  }
};
