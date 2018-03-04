import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleSubmit, handleTextFieldChange, username, password }) => (
    <div>
        <h2>Kirjaudu sovellukseen</h2>
        <form onSubmit={handleSubmit}>
            <div>
                käyttäjätunnus
           <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleTextFieldChange}
                />
            </div>
            <div>
                salasana
           <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleTextFieldChange}
                />
            </div>
            <button type="submit">kirjaudu</button>
        </form>
    </div>
)

LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleTextFieldChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
}

export default LoginForm