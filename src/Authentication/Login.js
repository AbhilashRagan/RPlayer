import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login()
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error1, setError1] = useState("");
    const [error2, setError2] = useState("");

    const nav = useNavigate();

    useEffect(() => {
        if(window.sessionStorage.getItem("token") != null)
        {
            window.sessionStorage.removeItem("token");
        }
        if(window.sessionStorage.getItem("accesstoken") != null)
        {
            window.sessionStorage.removeItem("accesstoken");
        }
    }, []);

    function handleEmailChange(e)
    {
        let id = String(e.target.value);
        let countat = 0;
        let countdot = 0;
        let error = "";
        for(let i in id)
        {
            if(id[i] == '@')
            {
                countat += 1;
            }
            if(id[i] == '.')
            {
                countdot += 1;
            }
        }
        if(countat == 1 && countdot == 1 && id.length > 2)
        {
            error = "";
        }
        else
        {
            error = "*Invalid email";
        }
        if(id == "")
        {
            error = "*Required Feild";
        }
        setEmail(e.target.value);
        setError1(error);
    }

    function handlePasswordChange(e)
    {
        let pass = String(e.target.value);
        let error = "";
        if(pass.length == 0)
        {
            error = "*Required Feild";
        }
        setPassword(e.target.value);
        setError2(error);
    }

    function handleClick()
    {
        if(error1 == "" && error2 == "")
        {
            let url = "http://localhost:80/rplayer/Login.php";
            let values = {
                email : email,
                password : password
            };
            fetch(url, {
                method : 'POST',
                headers : {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(values)
            }).then((response) => response.json()).then((data) => {
                if(data != "No user" && data != "Wrong password")
                {
                    window.sessionStorage.setItem('token', data);
                    nav("/home");
                }
                else
                {
                    alert(data);
                    setEmail("");
                    setPassword("");
                }
            });
        }
        else
        {
            alert("Invalid credentials");
            window.location.reload();
        }
    }

    function createAccount()
    {
        nav("/signin");
    }

    return(
        <div>
            <img className = "background" src = "/Resources/Background.png" alt = "err" />
            <div className = "logincontents">
                <h1>LogIn</h1>
                <div className = "email" >
                    <input type = "text" value = { email } placeholder = "Enter email" onChange = { handleEmailChange } />
                    <p>{ error1 }</p>
                </div>
                <br/>
                <div className = "password" >
                    <input type = "password" value = { password } placeholder = "Enter password" onChange = { handlePasswordChange } />
                    <p>{ error2 }</p>
                </div>
                <a onClick = { createAccount } >Create Account</a>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<a>Forgot password?</a>
                <br/><br/>
                <input type = "submit" value = "LogIn" onClick = { handleClick } />
                <br/><br/>
            </div>
        </div>
    );
}

export default Login;