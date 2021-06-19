import {fire} from '../app/firebase';

export const fireHandleLogin = async (email,password) =>{
    return await 
        fire
        .auth()
        .signInWithEmailAndPassword(email,password)
        .then(result=>result)
        .catch(err=>{
            return Promise.reject({code: err.code, message: err.message})
        });
}

export const fireHandleRegister = async (email,password) =>{
    return await 
        fire
        .auth()
        .createUserWithEmailAndPassword(email,password)
        .then(result=>result)
        .catch(err=>{
            return Promise.reject({code: err.code, message: err.message})
        });
}

export const firehandleLogout = async () =>{
    return await 
        fire.auth().signOut()
        .then(result=>result)
        .catch(err=>{
            return Promise.reject({code: err.code, message: err.message})
        });
}