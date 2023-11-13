import {
    createClient,
    createMicrophoneAndCameraTracks
} from "agora-rtc-react";
import { useState, useEffect } from 'react'
import config from './config.json'

import Control from "./VideoManagerComponent/Control";
import Video from "./VideoManagerComponent/Video";

const configVideo = { 
    mode: "live", codec: "vp8",
  };
  
const appId = config.appId; // ENTER APP ID HERE

const useClient = createClient(configVideo);

const VideoManager = (props) => {
    const { setInCall, channelName, userType, userId, token } = props;

    if(userType === "host"){
        return(<VideoManagerHost setInCall={setInCall} channelName={channelName} userType={userType} userId={userId} token={token}/>);
    }else{
        return(<VideoManagerClient setInCall={setInCall} channelName={channelName} userType={userType} userId={userId} token={token}/>);
    }
}

export const VideoManagerHost = (props) => {

    const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

    const { setInCall, channelName, userType, userId, token } = props;
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const client = useClient();

    const { ready, tracks } = useMicrophoneAndCameraTracks();


    const [myToken, setMyToken] = useState('')
    
    const [controller, setController] = useState(false);

    useEffect(() => {
        console.log("INI KEPANGGIL")
        console.log('role is', userType)

        if (ready && tracks) {
            console.log("init ready");
    
            client.on("user-published", async (user, mediaType) => {
              await client.subscribe(user, mediaType);
              console.log("subscribe success");
              if (mediaType === "video") {
                setUsers((prevUsers) => {
                  return [...prevUsers, user];
                });
                console.log('user list is ::::::::', user.uid)
              }
              if (mediaType === "audio") {
               user.audioTrack?.play();
              }
            });
        
            client.on("user-unpublished", (user, type) => {
              console.log("unpublished", user, type);
              if (type === "audio") {
                user.audioTrack?.stop();
              }
              if (type === "video") {
                setUsers((prevUsers) => {
                  return prevUsers.filter((User) => User.uid !== user.uid);
                });
              }
            });
    
            client.on("user-left", (user) => {
              console.log("leaving", user);
              setUsers((prevUsers) => {
                return prevUsers.filter((User) => User.uid !== user.uid);
              });
            });
    
            client.on("user-joined", (user) => {
              console.log("join", user);
              // setUsers((prevUsers) => {
              //   return prevUsers.filter((User) => User.uid !== user.uid);
              // });
            });
           
            if(!start){
                console.log("masuk ke atas")
                fetch(`https://us-central1-agore-node-express.cloudfunctions.net/app/access_token?channelName=${channelName}`)
                .then(function (response) {
                    response.json().then(async function (data) {
                        let token = data.token;
                        console.log("Token to acquire", token)
                        setMyToken(token)
                    
                        await client.join(appId, channelName, token, null);
                        await client.setClientRole("host");
                        await client.publish([tracks[0], tracks[1]]);
                        setStart(true);
                    })
                })
            }else{
                console.log("masuk ke bawah")
                //client.publish([tracks[0], tracks[1]]);
            }
          }
    
      }, [channelName, client, ready, tracks, controller]);

    return (
        <div className="App">
            {start && tracks ? <Video users={users} tracks={tracks} userType={userType} userId={userId} token={token}/> : <h3>Sedang Mempersiapkan Jendela Video</h3>}
            {ready && tracks && (
                <Control tracks={tracks} setStart={setStart} setInCall={setInCall} userType={userType} client={client} channelName={channelName} setController={setController} controller={controller}/>
            )}
        </div>
    );
}

export const VideoManagerClient = (props) => {

    const { setInCall, channelName, userType, userId, token } = props;
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const client = useClient();
    console.log("client", client)

    const [myToken, setMyToken] = useState('')

    useEffect(() => {
        console.log('role is', userType)
    
        console.log("init ready");

        client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === "video") {
            setUsers((prevUsers) => {
            return [...prevUsers, user];
            });
            console.log('user list is ::::::::', user.uid)
        }
        if (mediaType === "audio") {
            user.audioTrack?.play();
        }
        });
    
        client.on("user-unpublished", (user, type) => {
        console.log("unpublished", user, type);
        if (type === "audio") {
            user.audioTrack?.stop();
        }
        if (type === "video") {
            setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
            });
        }
        });

        client.on("user-left", (user) => {
        console.log("leaving", user);
        setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
        });
        });

        client.on("user-joined", (user) => {
        console.log("join", user);
        // setUsers((prevUsers) => {
        //   return prevUsers.filter((User) => User.uid !== user.uid);
        // });
        });

        if(!start){

            console.log("INI KEPANGGIL")

            fetch(`https://us-central1-agore-node-express.cloudfunctions.net/app/access_token?channelName=${channelName}`)
            .then(function (response) {
                response.json().then(async function (data) {
                let token = data.token;
                console.log("Token to acquire", token)
                setMyToken(token)
                
                await client.join(appId, channelName, token, null);
                await client.setClientRole("audience");

                setStart(true);
                })
            })
        }
    
      }, [channelName, client]);

    return (
        <div className="App">
            {start ? <Video users={users} userType={userType} channelName={channelName} userId={userId} token={token}/> : <h3>Sedang Mempersiapkan Jendela Video</h3>}
            <Control setStart={setStart} setInCall={setInCall} userType={userType} client={client}/>
        </div>
    );
}


export default VideoManager