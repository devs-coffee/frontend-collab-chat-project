import { useState } from "react";
import { useSelector } from "react-redux";
import { MessageBox } from "../../components";
import { reduxData } from "../../interfaces/IReduxData";

export const PrivateMessages = () => {
    const privateChans = useSelector((state: reduxData) => state.privateChans.data);
    const [channelId, setChannelId] = useState<string>('');
    
    return (
        <div className="PrivateMessages">
            <h2>private messages</h2>
            <div className="userList">
                {privateChans && privateChans.map((chan) => (
                    <p key={`private_${chan.users[0].user.id}`} onClick={() => {setChannelId(chan.id)}}>{chan.users[0].user.pseudo}</p>
                ))}
            </div>
            <div className="private-messages-box">
                    {channelId !== '' && <MessageBox channelId={channelId} canUserPost={true} key={channelId} />}
            </div>
        </div>
    )
}