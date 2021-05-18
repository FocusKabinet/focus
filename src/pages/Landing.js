import React from 'react'
import { Link } from 'react-router-dom';

function Landing() {
    return (
        <div>
          Landing
          <Link to={"/register"}><button>register</button></Link> 
          <Link to={"/login"}><button>login</button></Link>  
        </div>
    )
}

export default Landing
