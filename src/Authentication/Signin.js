import "./Signin.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signin()
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error1, setError1] = useState("");
    const [error2, setError2] = useState("");
    const [error3, setError3] = useState("");

    const nav = useNavigate();

    function handleEmailChange(e)
    {
        let id = String(e.target.value);
        let countdot = 0;
        let countat = 0;
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
        if(id.length == "")
        {
            error = "";
        }
        setEmail(e.target.value);
        setError1(error);
    }

    function handlePasswordChange(e)
    {
        let pass = String(e.target.value);
        let error = "";
        if(pass.length < 8)
        {
            error = "*Requried minimum 8 characters"
        }
        if(pass == "")
        {
            error = "*Required Feild";
        }
        setPassword(e.target.value);
        setError2(error);
    }

    function handlePassword2Change(e)
    {
        let pass = String(e.target.value);
        let error = "";
        if(pass != password)
        {
            error = "*Confirmation password not same";
        }
        if(pass == "")
        {
            error = "*Required Feild";
        }
        setPassword2(e.target.value);
        setError3(error);
    }

    function login()
    {
        nav("/");
    }

    function handleClick()
    {
        if(error1 == "" && error2 == "" && error3 == "")
        {
            let url = "http://localhost:80/RPlayer/Signin.php";
            let values = {
                email : email, 
                password : password
            };
            fetch(url, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json',
                    'Accept' : 'application/json'
                },
                body : JSON.stringify(values)
            }).then((response) => response.json()).then((data) => {
                if(data == "Fetched")
                {
                    console.log(data);
                    nav("/");
                }
                else if(data == "Account Exists")
                {
                    alert("Account already exists");
                    setEmail("");
                    setPassword("");
                    setPassword2("");
                }
            });
        }
        else
        {
            alert("Invalid credentials");
            window.location.reload();
        }
    }

    return(
        <div>
            <img className = "background" src = "/Resources/Background.png" alt = "err" />
            <div className = "signincontents">
                <h1>SignIn</h1>
                <div className = "email">
                    <input type = "text" value = { email } placeholder = "Enter email" onChange = { handleEmailChange } />
                    <p>{ error1 }</p>
                </div>
                <br/>
                <div className = "password">
                    <input type = "password" value = { password } placeholder = "Enter password" onChange = { handlePasswordChange } />
                    <p>{ error2 }</p>
                </div>
                <br/>
                <div className = "confirmpassword">
                    <input type = "password" value = { password2 } placeholder = "Confirm password"  onChange = { handlePassword2Change } />
                    <p>{ error3 }</p>
                </div>
                <a onClick = { login } >Already have an account?</a>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                <br/><br/>
                <input type = "submit" value = "SignIn" onClick = { handleClick } />
                <br/><br/>
            </div>
        </div>
    );
}

export default Signin;