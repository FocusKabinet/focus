export const loadState = (key) => {
  let serializedState;

  try {
    serializedState = JSON.parse(window.localStorage.getItem(key));

    console.log(`loaded state '${key}' from localStorage`);
  } catch (e) {
    console.log(`failed to load '${key}' localStorage state`);
  }

  return serializedState;
};

export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    window.localStorage.setItem(key, serializedState);
  } catch {
    console.log('localStorage:', 'failed to save state');
  }
};
