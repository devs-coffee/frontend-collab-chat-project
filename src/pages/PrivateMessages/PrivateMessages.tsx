import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { IoProvider } from '../../interfaces/IIoProvider';
import useIoSocket from "../../hooks/useIoSocket";
import { MessageBox } from "../../components";
import { reduxData } from "../../interfaces/IReduxData";
import { addOrUpdateMessage } from "../../redux/messagesSlice";
import { IMessage } from "../../interfaces/IMessage";

export const PrivateMessages = () => {
    const { Socket } = useIoSocket() as IoProvider;
    const dispatch = useDispatch();
    const privateChans = useSelector((state: reduxData) => state.privateChans.data);
    const messagesData = useSelector((state: reduxData) => state.messages);
    const users = useSelector((state: reduxData) => state.users.data);
    const [channelId, setChannelId] = useState<string>('');
    const [toUserId, setToUserId] = useState<string | undefined>(undefined);

    
    useEffect(() => {
        Socket.on("privateMessage", (message:IMessage) => {
            dispatch<any>(addOrUpdateMessage(message));
        });
        return () => {
            Socket.off("privateMessage");
        }
    }, [dispatch, messagesData])

    return (
        <div className="PrivateMessages">
            <h2>private messages</h2>
            <div className="userList">
                {privateChans && privateChans.map((chan) => (
                    <p key={`private_${chan.users[0]}`} onClick={() => {setChannelId(chan.id); setToUserId(chan.users[0])}}>{users.find(user => user.id === chan.users[0])!.pseudo}</p>
                ))}
            </div>
            <div className="private-messages-box">
                    {channelId !== '' && <MessageBox channelId={channelId} canUserPost={true} toUserId={toUserId} key={channelId} />}
            </div>
        </div>
    )
}