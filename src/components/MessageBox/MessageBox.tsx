import { useEffect, useState } from "react";
import { MessageService } from "../../services/messageService";
import MessageEditor from "../MessageEditor/MessageEditor";
import MessageList from "../MessageList/MessageList";
import { useDispatch } from 'react-redux';
import { addMessage, fetchMessages, setMessages } from "../../redux/messagesSlice";
import "./MessageBox.scss";
import { IMessage } from "../../interfaces/IMessage";
import { useSelector } from "react-redux";
import { AxiosError } from "axios";
import { Snackbar } from "@mui/material";

type ChannelId = {
    channelId: string
  }

export default function MessageBox ( { channelId } : ChannelId) {
    const messageService = new MessageService();
    const authStatus = useSelector((state:any) => state.auth);
    const stateMessages = useSelector((state:any) => state.messages);
    const messages = useSelector((state:any) => state.messages.data[channelId]);
    const [getMessagesError, setGetMessagesError] = useState<{isError: boolean, errorMessage: string}>({isError:false, errorMessage:''});
    const dispatch = useDispatch();

    const sendMessage = async (messageContent:string) => {
        if(messageContent === '') {
            return;
        }
        try {
            const message: IMessage = {
                userId: authStatus.user.id,
                channelId: channelId,
                content: messageContent
            }
            const response = await messageService.send(message);
            if(response.isSucceed){
                const message = response.result;
                dispatch<any>(addMessage({channelId, message}))
            }
        }
        catch(error){
            let errorMessage:string;
            if(error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            } else {
                errorMessage = 'une erreur est survenue, veuillez réessayer';
            }
            setGetMessagesError({isError: true, errorMessage});
        }
    }

    const handleToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if(reason === 'clickaway') {
            return;
        }
        setGetMessagesError({isError:false, errorMessage:''});
    }

    useEffect(() => {
        if(stateMessages.status === "idle" || messages === undefined) {
          dispatch<any>(fetchMessages(channelId));
        }
    },[stateMessages.status, dispatch, channelId])
    
    return (
        <div className="MessageBox">
            <MessageList messages={messages} />
            <MessageEditor sendMessage={sendMessage}/>
            <Snackbar 
            open={getMessagesError.isError}
            autoHideDuration={4000}
            onClose={handleToastClose}
            message={getMessagesError.errorMessage}
        />
        </div>
    )
}