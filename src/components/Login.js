import React from 'react'
import { Link } from 'react-router-dom';

function Login(props) {
    const {email, setEmail, password, setPassword, handleLogin, handleRegister, hasAccount, setHasAccount, emailError, passwordError} = props;
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
                        <button onClick={handleLogin}>Sign In</button>
                        <p>No Account? <Link to={"/register"} onClick={()=> setHasAccount(!hasAccount)}>Register</Link></p>
                    </div>
                </div>
            </section>

            <Link to={"/home"}><button>home</button></Link>
        </div>
    )
}

export default Login
