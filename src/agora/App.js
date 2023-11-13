"use client"

import { useState } from "react";

import VideoManager from "./manager/VideoManager";

const App = () => {
    const [inCall, setInCall] = useState(false);
    const [channelName, setChannelName] = useState("");
    const [userID, setUserID] = useState("");
    const [token, setToken] = useState("");
    const [userType, setUserType] = useState("audience");

    return (
        <div>
        <h1 className="heading">Agora Testing Apps</h1>
        {inCall ? (
            <VideoManager setInCall={setInCall} channelName={channelName} userType={userType} userId={userID} token={token} />
        ) : (
            <ChannelForm setInCall={setInCall} setChannelName={setChannelName} setUserID={setUserID} setUserType={setUserType} setToken={setToken} />
        )}
        </div>
    );
};

const ChannelForm = (props) => {
    const { setInCall, setChannelName, setUserID, setUserType, setToken } = props;

    return (
        <form className="join">
            <input type="text"
                placeholder="Enter Channel Name"
                onChange={(e) => setChannelName(e.target.value)}
            />
            <input type="text"
                placeholder="Enter User ID"
                onChange={(e) => setUserID(e.target.value)}
            />
            <input type="text"
                placeholder="Enter your Token"
                onChange={(e) => setToken(e.target.value)}
            />
            <select onChange={((e) => setUserType(e.target.value))}>
                <option value="audience">Audience</option>
                <option value="host">Host</option>
            </select>
            <button onClick={(e) => {
                e.preventDefault();
                setInCall(true);
            }}>
                Join
            </button>
        </form>
    );
};

export default App;