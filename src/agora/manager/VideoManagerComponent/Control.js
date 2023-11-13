import { useState } from 'react'

const Control = (props) => {
    const { tracks, setStart, setInCall, userType, client, setController, controller } = props;
    const [trackState, setTrackState] = useState({ video: true, audio: true });

    const mute = async (type) => {
        if (type === "audio") {
            await tracks[0].setEnabled(!trackState.audio);
            setController(!controller)
            setTrackState((ps) => {
                return { ...ps, audio: !ps.audio };
            });
        } else if (type === "video") {
            await tracks[1].setEnabled(!trackState.video);
            setController(!controller)
            setTrackState((ps) => {
                return { ...ps, video: !ps.video };
            });
        }
    };

    const leaveChannel = async () => {
        await client.leave();
        client.removeAllListeners();

        if(userType === "host"){
            tracks[0].close();
            tracks[1].close();
        }
        
        setStart(false);
        setInCall(false);
    };

    return (
        <div className="controls">
        { userType === 'host' && (<p className={trackState.audio ? "on" : ""}
            onClick={() => mute("audio")}>
            {trackState.audio ? "Mute Audio" : "Unmute Audio"}
        </p>)}
        { userType === 'host' && (<p className={trackState.video ? "on" : ""}
            onClick={() => mute("video")}>
            {trackState.video ? "Mute Video" : "Unmute Video"}
        </p>)}
        {<p onClick={() => leaveChannel()}>Leave</p>}
        </div>
    );
};

export default Control