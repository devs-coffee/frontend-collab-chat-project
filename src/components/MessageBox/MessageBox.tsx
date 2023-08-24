import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { IoProvider } from '../../interfaces/IIoProvider';
import { IMessage } from "../../interfaces/IMessage";
import { reduxData } from "../../interfaces/IReduxData";
import { addMessage, fetchMessages } from "../../redux/messagesSlice";
import { MessageService } from "../../services/messageService";
import { MessageEditor, MessageList, MessageError } from "../index";

import "./MessageBox.scss";
import useIoSocket from "../../hooks/useIoSocket";

type MessageBoxProps = {
    channelId: string,
    canUserPost: boolean
}

export function MessageBox({ channelId, canUserPost }: MessageBoxProps) {
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
                channelId: channelId,
                content: messageContent
            }
            const response = await new MessageService().send(message);
            if (response.isSucceed) {
                const message = response.result;
                dispatch<any>(addMessage(message))
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
                dispatch<any>(addMessage(res))
            }
        });
        return () => {
            Socket.off(`message_${channelId}`)
        }
    }, [stateMessages, dispatch, channelId, authStatus, Socket])

    return (
        <div className="MessageBox">
            <MessageList messages={stateMessages.data[channelId]} />
            {canUserPost && <MessageEditor sendMessage={sendMessage} />}

            
            <MessageError
                open={getMessagesError.isError}
                setCallbackClose={() => setGetMessagesError({ isError: false, errorMessage: '' })}
                message={getMessagesError.errorMessage}
            />
        </div>
    )
}