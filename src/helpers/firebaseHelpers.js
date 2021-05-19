import {fire} from '../app/firebase';

export const fireHandleLogin = async (email,password) =>{
    const res = await 
        fire
        .auth()
        .signInWithEmailAndPassword(email,password)
        .then(result=>result)
        .catch(err=>{
            return Promise.reject({code: err.code, message: err.message})
        });
}

export const fireHandleRegister = async (email,password) =>{
    const res = await 
        fire
        .auth()
        .createUserWithEmailAndPassword(email,password)
        .then(result=>result)
        .catch(err=>{
            return Promise.reject({code: err.code, message: err.message})
        });
}

export const firehandleLogout = async () =>{
    const res = await 
        fire.auth().signOut()
        .then(result=>result)
        .catch(err=>{
            return Promise.reject({code: err.code, message: err.message})
        });
}