import "./Player.css";
import { useEffect, useState } from "react";

function Player(props)
{
    const [image, setImage] = useState("/Resources/Background.png");
    const [name, setName] = useState("No Audio");
    const [artist, setArtist] = useState("None");
    const [url, setURL] = useState("");

    useEffect(() => {
        fetchSongDetails(props['id']);
    }, [props['id']]);

    function fetchSongDetails(id)
    {
        if(props['id'] != "")
        {                
            let url = "https://api.spotify.com/v1/tracks/" + id;
            let params = {
                headers : {
                    'Authorization' :  `Bearer ${ window.sessionStorage.getItem("accesstoken") }`
                }
            };
            fetch(url, params).then((response) => response.json()).then((data) => {
                console.log(data);
                let artists = "";
                for(let i in data['artists'])
                {
                    artists += data['artists'][i]['name'] + ","; 
                }
                artists = artists.slice(0, artists.length - 1);
                setImage(data['album']['images'][0]['url']);
                setName(data['name']);
                setArtist(artists);
                setURL(data['preview_url']);
            });
        }
    }

    return(
        <div className = "player">
            <img src = { image } alt = "err" />
            &emsp;&emsp;&emsp;
            <div className = "details">
                <h1>{ name }</h1>
                <marquee>{ artist }</marquee>
            </div>
            <audio src = { url } autoPlay = { true } />
        </div>
    );
}

export default Player;