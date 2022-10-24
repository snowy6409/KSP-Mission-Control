import React from "react";
import "./loginpagestyle.css"

function Login({login}) {
    return (
        <div>
            <div className="container">
                <label htmlFor="uname"><b>Username</b></label>
                <input id={"uname"} type="text" placeholder="Enter Username" name="uname" required/>
                <label htmlFor="psw"><b>Password</b></label>
                <input id={"psw"} type="password" placeholder="Enter Password" name="psw" required/>
                <button type="submit"
                        onClick={() => login(document.getElementById("uname").value, document.getElementById("psw").value)}>Login
                </button>
            </div>
        </div>
    );
}

export default Login;