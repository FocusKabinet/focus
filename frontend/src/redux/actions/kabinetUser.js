export const UserTypes = {
  SET_PROFILE: 'SET_PROFILE',
};

export const setProfile = (profile) => ({
  type: UserTypes.SET_PROFILE,
  payload: profile,
});
