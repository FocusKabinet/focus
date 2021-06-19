import React from 'react'
import { Link } from 'react-router-dom';

function Register(props) {
    const {email, setEmail, password, setPassword, handleRegister, hasAccount, setHasAccount, emailError, passwordError} = props;
    return (
        <div>
            <section>
                <div>
                    <label>Email</label>
                    <input type="text" autoFocus required value={email} onChange={e=>setEmail(e.target.value)}/>
                    <p>{emailError}</p>
                    <label>Pasword</label>
                    <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/>
                    <p>{passwordError}</p>
                    <div>
                        <button onClick={handleRegister}>Sign Up</button>
                        <p>Have an account?  <Link to={"/login"} onClick={()=> setHasAccount(!hasAccount)}>Sign In</Link></p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Register
