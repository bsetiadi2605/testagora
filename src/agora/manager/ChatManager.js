"use client"
import AC from "agora-chat";
import { useState } from "react";
import config from './config.json'

const ChatManager = (props) => {

    const { channelName, userType, userId , token } = props

    const appKey = config.appKey;
    const agoraChatEngine = new AC.connection({appKey:appKey});

    const [isJoin, setIsJoin] = useState(false)

    const [messageData, setMessageData] = useState([
        {
            user : {
                name : "Bagus",
                color : 'red'
            },
            message : "Ini hardcode data untuk menampilkan list chat saja"
        },
        {
            user : {
                name : "Alifia",
                color : 'blue'
            },
            message : "Ini hardcode data untuk menampilkan list chat saja"
        },
        {
            user : {
                name : "Vanda",
                color : 'Green'
            },
            message : "Ini hardcode data untuk menampilkan list chat saja"
        },
    ])

    const initData = () => {
        agoraChatEngine.addEventHandler("connection&message&chatroom", {
            // Occurs when the app is connected to Agora Chat.
            onConnected: (value) => {
                console.log("onConnected",value)
                createChatRoom()
            },
            // Occurs when the app is disconnected from Agora Chat.
            onDisconnected: (value) => {
                console.log("onDisconnected",value)
            },
            // Occurs when a text message is received.
            onTextMessage: (message) => {
                console.log("onTextMessage",message);
            },
            // Occurs when the token is about to expire.
            onTokenWillExpire: (params) => {
                console.log("onTokenWillExpire",params);
            },
            // Occurs when the token has expired. 
            onTokenExpired: (params) => {
                console.log("onTokenExpired",params);
            },
            onChatroomEvent: (value) => {
                console.log("onChatroomEvent", value);
            },
            onError: (error) => {
                console.log("on error", error);
            },
        });
    }

    const login = async () => {

        try {
            const result = await agoraChatEngine.open({
                user: userId,
                agoraToken: token,
            });

            console.log("hasilLogin", result)
            //createChatRoom(result.accessToken)
            getConversation()
        } catch (err) {
            console.log("ERROR WHEN LOGIN", err)
        }
        
    }

    const logout = () => {
        agoraChatEngine.close()
    }

    const createChatRoom = async (token) => {
        console.log("masuk chat room")
        try {
            //const data = await agoraChatEngine.getChatRoomAdmin({chatRoomId: '230807760338945'})
            const data = await agoraChatEngine.joinChatRoom({roomId: '230807760338945'})
            console.log("hasil", data)
            setIsJoin(true)
        } catch(err){
            console.log("KENA ERROR CHAT ROOM", err)
        } 
    }

    const getConversation = async() => {
        
        try {
            const data = await agoraChatEngine.getConversationlist({pageNum: 1, pageSize: 20})
            console.log("hasil conversation", data)
            setMessageData([...messageData, {
                user : {
                    name : data.data.channel_infos[0].lastMessage.from,
                    color : 'red'
                },
                message : data.data.channel_infos[0].lastMessage.msg + ` - ${new Date(data.data.channel_infos[0].lastMessage.time)}`
            }])
        } catch(err){
            console.log("KENA ERROR CHAT ROOM", err)
        }
    }
    
    const sendMessage = async(message) => {
        let option = {
            type: "txt",
			chatType: "chatRoom",
			to: "230807760338945",
			msg: message,
		};

        let msg = new AC.message.create(option);
        console.log(msg)

        try {
            const sendMessage = await agoraChatEngine.send(msg)
            console.log("send message", sendMessage)
        } catch (error) {
            console.log("failed",error);
        }
    }

    if(!isJoin){
        initData()
        login()
    }
    

    const [textArea, setTextArea] = useState("");

    const submitMessage = (e) => {
        console.log("enter", e)
        if (e.code === "Enter") {
            e.preventDefault();
            if (textArea.trim().length === 0) return;
            sendMessage(e.currentTarget.value)
            setMessageData([...messageData, {
                user : {
                    name : userId,
                    color : 'blue'
                },
                message : e.currentTarget.value + ` - ${new Date()}`
            }])
            setTextArea("");
        }
    };

    if(!isJoin){
        return(
            <div className="chatContainer">
                <h2>Mencoba Terhubung ke chat room</h2>
            </div>
        );
    }else{
        return(
            <div className="chatContainer">
                <div>
                    <textarea
                    placeholder="Type message here"
                    className="textMessage"
                    onChange={(e) => setTextArea(e.target.value)}
                    aria-label="With textarea"
                    value={textArea}
                    onKeyDown={submitMessage}
                    />
                </div>
                <div>
                    {messageData.map((data, index) => {
                    return (
                        <div className="chat" key={`chat${index + 1}`}>
                            <h5 className="font-size-15" style={{ color: data.user.color, width: '25%' }}>
                                {`${data.user.name} :`}
                            </h5>
                            <p className="text-break" style={{ color: data.user.color, width: '75%' }}>{` ${data.message}`}</p>
                        </div>
                    );
                    })}
                </div>
            </div>
        );
    }
}

export default ChatManager