import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { IoProvider } from '../../interfaces/IIoProvider';
import useIoSocket from "../../hooks/useIoSocket";
import { IMessage } from "../../interfaces/IMessage";
import { reduxData } from "../../interfaces/IReduxData";
import { addOrUpdateMessage, fetchMessages, removeMessage } from "../../redux/messagesSlice";
import { MessageService } from "../../services/messageService";

import { MessageEditor, MessageList, MessageError } from "../";

import "./MessageBox.scss";

type MessageBoxProps = {
    channelId: string,
    canUserPost: boolean,
    toUserId?: string
}

export function MessageBox({ channelId, canUserPost, toUserId }: MessageBoxProps) {
    const authStatus = useSelector((state: reduxData) => state.authStatus);
    const stateMessages = useSelector((state: reduxData) => state.messages);
    const [getMessagesError, setGetMessagesError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });
    const dispatch = useDispatch();
    const { Socket } = useIoSocket() as IoProvider;

    const sendMessage = async (messageContent: string) => {
        if (messageContent === '') {
            return;
        }
        try {
            const message: IMessage = {
                userId: authStatus!.user!.id,
                content: messageContent
            }
            if(toUserId) {
                message.toUserId = toUserId;
            } else {
                message.channelId = channelId;
            }
            const response = await new MessageService().send(message);
            if (response.isSucceed) {
                const message = response.result;
                dispatch<any>(addOrUpdateMessage(message))
            }
        }
        catch (error) {
            let errorMessage: string;
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            } else {
                errorMessage = 'une erreur est survenue, veuillez réessayer';
            }
            setGetMessagesError({ isError: true, errorMessage });
        }
    }

    useEffect(() => {
        if (stateMessages.status === "idle" || stateMessages.data[channelId] === undefined) {
            dispatch<any>(fetchMessages(channelId));

        }
        Socket.on(`message_${channelId}`, (res: IMessage) => {
            if (res.userId !== authStatus!.user!.id) {
                dispatch<any>(addOrUpdateMessage(res))
            }
        });
        Socket.on('deleteMessage', (message: IMessage) => {
            dispatch(removeMessage(message));
        })
        return () => {
            Socket.off(`message_${channelId}`)
        }
    }, [stateMessages, dispatch, channelId, authStatus, Socket])

    return (
        <div className="MessageBox">
            <MessageList messages={stateMessages.data[channelId]} channelId={channelId} />
            {canUserPost && <MessageEditor sendMessage={sendMessage} />}
            <MessageError
                open={getMessagesError.isError}
                setCallbackClose={() => setGetMessagesError({ isError: false, errorMessage: '' })}
                message={getMessagesError.errorMessage}
            />
        </div>
    )
}