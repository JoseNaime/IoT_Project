import React from 'react';

function Login({setUserId}) {

    const handleFormSubmit = (e) => {
        setUserId(e.target.userId.value);

        e.preventDefault();
    }
    return (
        <div id="login">
            <div className="back-screen" />
            <div className="popup-container">
                <h2>Login</h2>
                <form onSubmit={handleFormSubmit}>
                    <p> </p>
                    <label>
                        <p>User ID</p>
                        <div className="input-container">
                            <input type="text" name="userId" />
                        </div>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
    );
}

export default Login;