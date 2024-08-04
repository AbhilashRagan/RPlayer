import "./Player.css";
import TrackDisplay from "./TrackDisplay";
import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

function Player(props)
{
    const [image, setImage] = useState("/Resources/Background.png");
    const [name, setName] = useState("No Audio");
    const [artist, setArtist] = useState("None");
    const [EmbedController, setEmbedController] = useState(null);
    const [playState, setPlayState] = useState(false);
    const [maxTime, setMaxTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isDisplay, setIsDisplay] = useState(false);
    const [lyrics, setLyrics] = useState("No Lyrics");
    const [lyricsDisplay, setLyricsDisplay] = useState(false);

    useEffect(() => {
        if(window.sessionStorage.getItem('token') != null)
        {
            let url = "http://localhost:80/rplayer/Decode.php";
            let values = {
                token : window.sessionStorage.getItem('token')
            };
            fetch(url, {
                method : 'POST',
                headers : {
                    'Accept' : 'application/json',
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify(values)
            }).then((response) => response.json()).then((data) => {
                if(data == "Authorized")
                {
                    const script = document.createElement("script");
                    script.src = "https://open.spotify.com/embed/iframe-api/v1";
                    script.async = true;
                    document.body.appendChild(script);
                    window.onSpotifyIframeApiReady = (IFrameAPI) => {
                        const element = document.getElementById("iFrame");
                        const options = {
                            uri : ''
                        };
                        const callback = (EmbedController) => {
                            setEmbedController(EmbedController);
                        };
                        IFrameAPI.createController(element, options, callback);
                    };
                }
            })
        }
    }, []);

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
                let artists = "";
                for(let i in data['artists'])
                {
                    artists += data['artists'][i]['name'] + ","; 
                }
                let url2 = "https://api.lyrics.ovh/v1/" + data['artists'][0]['name'] + "/" + data['name'];
                fetch(url2).then((response) => response.json()).then((data) => {
                    setLyrics(data['lyrics']);
                });
                artists = artists.slice(0, artists.length - 1);
                EmbedController.loadUri(data['uri']);
                EmbedController.play();
                EmbedController.addListener('playback_update', e => {
                    setCurrentTime(Math.floor(e.data.position/1000));
                });
                setMaxTime(Math.floor(data['duration_ms']/1000));
                setPlayState(true);
                setImage(data['album']['images'][0]['url']);
                setName(data['name']);
                setArtist(artists);
            });
        }
    }

    function togglePlayState()
    {
        if(playState)
        {
            EmbedController.pause()
        }
        else
        {
            EmbedController.resume();
        }
        setPlayState(!playState);
    }

    function seek(e)
    {
        EmbedController.seek(Math.floor(e.target.value));
        setCurrentTime(Math.floor(e.target.value));
    }

    function displayTrackDetails()
    {
        setIsDisplay(!isDisplay);
    }

    function hideshowlyrics()
    {
        if(!lyricsDisplay)
        {
            animate(".lyrics", {x : ['-50%', '-50%'], y : ['-50%', '-145%']}, { ease : 'easeInOut' });
        }
        else
        {
            animate(".lyrics", {x : ['-50%', '-50%'], y : ['-145%', '-50%']}, { ease : 'easeInOut' });
        }
        setLyricsDisplay(!lyricsDisplay);
    }

    return(
        <>
            <div id = "iFrame">
            
            </div>
            <div className = "player" >
                <img src = { image } alt = "err" onClick = { displayTrackDetails } />
                &emsp;&emsp;
                <div className = "details">
                    <h1>{ name }</h1>
                    <marquee>{ artist }</marquee>
                </div> 
                &emsp;&emsp;&emsp;
                <div className = "controls">
                    <div className = "buttons">
                        <img className = "playpause" src = { playState ? "/Resources/Pause.png" : "/Resources/Play.png" } onClick = { togglePlayState } />
                    </div>
                    <div className = "progress">
                        <h1>
                            { Math.floor(currentTime/60) < 10 ? "0" : "" }
                            { Math.floor(currentTime/60) }
                            :
                            { Math.floor(currentTime - 60*Math.floor(currentTime/60)) < 10 ? "0" : "" }
                            { Math.floor(currentTime - 60*Math.floor(currentTime/60)) }
                        </h1>
                        <input type = "range" value = { currentTime } min = { 0 } max = { maxTime } onChange = { (e) => { seek(e) } } />
                        <h1>
                            { Math.floor(maxTime/60) < 10 ? "0" : "" }
                            { Math.floor(maxTime/60) }
                            :
                            { Math.floor(maxTime - 60*Math.floor(maxTime/60)) < 10 ? "0" : "" }
                            { Math.floor(maxTime - 60*Math.floor(maxTime/60)) }
                        </h1>
                    </div>
                </div>
            </div>
            { isDisplay ? null : <TrackDisplay id = { props['id'] } /> }
            <motion.div className = "lyrics">
                <div className = "drag" onClick = { hideshowlyrics }>
                    ^
                </div>
                <div className = "text">
                    { lyrics }
                </div>
            </motion.div>
        </>
    );
}

export default Player;