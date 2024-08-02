import Login from "./Authentication/Login";
import Signin from "./Authentication/Signin";
import Home from "./Components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App()
{
    return(
        <BrowserRouter>
            <Routes>
                <Route path = "/" element = { <Login /> } />
                <Route path = "/signin" element = { <Signin /> } />
                <Route path = "/home" element = { <Home /> } />
            </Routes>
        </BrowserRouter>
    )
}

export default App;