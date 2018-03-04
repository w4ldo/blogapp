import React from 'react'
const LogoutForm = ({ logout }) => (
    <div>
        <form onSubmit={logout}>
            <button type="submit">Logout</button>
        </form>
    </div>
)

export default LogoutForm