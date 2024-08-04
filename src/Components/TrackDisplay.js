import "./TrackDisplay.css"
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function TrackDisplay(props)
{
    const [image, setImage] = useState("/Resources/Background.png");
    const [name, setName] = useState("No Audio")
    const [artist, setArtist] = useState("None");

    useEffect(() => {
        if(props['id'] != "")
        {    
            let url = "https://api.spotify.com/v1/tracks/" + props['id'];
            let params = {
                'Authorization' : `Bearere ${ window.sessionStorage.getItem("accesstoken") }`
            };
            fetch(url, params).then((response) => response.json()).then((data) => {
                let artists = [];
                for(let i in data['artists'])
                {
                    artists.push(data['artists'][i]['name']);
                    artists.push(<br/>);
                }
                setImage(data['album']['images'][0]['url']);
                setName(data['name']);
                setArtist(artists);
            });
        }
    }, [props['id']]);

    return(
        <motion.div className = "trackdisplay" initial = {{ x : '100%', y : '-50%' }} animate = {{ x : '0%', y : '-50%' }} transition = {{ type : 'spring', duration : 0.4, bounce : 0.5 }} >
            <img src = { image } />
            <h1 className = "name">{ name }</h1>
            <h1 className = "artist">{ artist }</h1>
        </motion.div>
    );
}

export default TrackDisplay;