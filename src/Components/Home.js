import "./Home.css";
import Player from "./Player";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home()
{
    const [search, setSearch] = useState("");
    const [searchresults, setSearchResults] = useState("");
    const [currentSong, setCurrentSong] = useState("");

    const nav = useNavigate();

    useEffect(() => {
        window.sessionStorage.removeItem("accesstoken");
        if(window.sessionStorage.getItem('token') == null)
        {
            nav("/");
        }
        else
        {
            let url = "http://localhost:80/rplayer/Decode.php";
            let values = {
                token : window.sessionStorage.getItem("token")
            };
            fetch(url, {
                method : 'POST',
                headers : {
                    'Accept' : 'application/json',
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify(values)
            }).then((response) => response.json()).then((data) => {
                if(data == "Unauthorized")
                {
                    nav("/");
                }
                else
                {
                    let url = "https://accounts.spotify.com/api/token";
                    const client_id = "cdb2bdcfabf444f8a0bf3096570beb62";
                    const client_secret = "45174d050da3453fadb8bfeed6ee3f86";
                    let authParams = {
                        method : 'POST',
                        headers : {
                            'Content-Type' : 'application/x-www-form-urlencoded'
                        },
                        body : 'grant_type=client_credentials&client_id=' + client_id + "&client_secret=" + client_secret
                    };
                    fetch(url, authParams).then((response) => response.json()).then((data) => {
                        window.sessionStorage.setItem("accesstoken", data['access_token']);
                    });
                }
            });
        }
    }, []);

    function handleSearchChange(e)
    {
        let url = "https://api.spotify.com/v1/search?q=" + e.target.value + "&type=track";
        let params = {
            headers : {
                'Authorization' : `Bearer ${ window.sessionStorage.getItem("accesstoken") }`
            }
        };
        if(e.target.value != "")
        {
            fetch(url, params).then((response) => response.json()).then((data) => {
                let results = [];
                for(let i in data['tracks']['items'])
                {
                    let element =   <div className = "elem" onClick = { () => { fetchDetails(data['tracks']['items'][i]) } } >
                                        <img src = { data['tracks']['items'][i]['album']['images'][0]['url'] } alt = "err" />
                                        &emsp;
                                        <h1>{ data['tracks']['items'][i]['name'] }</h1>
                                    </div>
                    results.push(element);
                    results.push(<br/>);

                }
                setSearchResults(results);
            });
        }
        setSearch(e.target.value);
    }

    function fetchDetails(data)
    {
        setSearch("");
        setSearchResults(null);
        setCurrentSong(data['id']);
    }

    return(
        <div>
            <img className = "background" src = "/Resources/Background.png" alt = "error" />
            <div className = "homecontents">
                <div className = "searchbar">
                    <input type = "text" value = { search } placeholder = "Search" onChange = { handleSearchChange } />
                    <img className = "searchicon" src = "/Resources/Search.png" alt = "err" />
                    { search == "" ? null : 
                        <div className = "searchresult">
                            { searchresults }
                        </div>
                    }
                </div>
            </div>
            <Player id = { currentSong } />
        </div>
    );
}

export default Home;