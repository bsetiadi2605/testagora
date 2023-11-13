import {
    AgoraVideoPlayer
} from "agora-rtc-react";

import ChatManager from "../ChatManager";

const Video = (props) => {
    const { users, tracks, userType, channelName, userId, token } = props;

    if(userType === 'host'){
        return (
        <div className="videoContainer">
            <AgoraVideoPlayer className='vid' videoTrack={tracks[1]}  style={{height: '100%', width: '75%'}} />
            <div style={{height: '100%', width: '25%'}}>
                <ChatManager channelName={channelName} userType={userType} userId={userId} token={token}/>
            </div>
        </div>
        )
    } else {
        if(users.length > 0){
            if(users[0].videoTrack){
                return (
                <div className="videoContainer">
                    <AgoraVideoPlayer className='vid' videoTrack={users[0].videoTrack}  style={{height: '100%', width: '75%'}} />
                    <div style={{height: '100%', width: '25%'}}>
                        <ChatManager channelName={channelName} userType={userType} userId={userId} token={token}/>
                    </div>
                </div>
                )
            }else{
                return null
            }
        }else {
            return null
        }
    }
};

export default Video