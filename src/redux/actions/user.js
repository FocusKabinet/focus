export const UserTypes = {
    LOGIN: 'LOGIN',
    ADD_USER: 'ADD_USER',
    UPDATE_USER: 'UPDATE_USER',
    LOGOUT: 'LOGOUT',
}

export const UserActionCreators = {

    addProfile: (user) => ({ type: UserTypes.ADD_USER, payload: { user } }),
    
    updateProfile: (user) => ({ type: UserTypes.UPDATE_USER, payload: { user } }),
    
    login: (user) => ({ type: UserTypes.LOGIN, payload: { user } }),

    logout: (user) => ({ type: UserTypes.LOGOUT, payload: { user } }),

}