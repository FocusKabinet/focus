import React from 'react'

function Home({handleLogout, ...props}) {
    return (
        <div>
            Home
            <button onClick={handleLogout}>logout</button>
        </div>
    )
}

export default Home
