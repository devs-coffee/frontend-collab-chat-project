import { useEffect, useState } from "react";
import { MessageService } from "../../services/messageService";
import MessageEditor from "../MessageEditor/MessageEditor";
import MessageList from "../MessageList/MessageList";
import { useDispatch } from 'react-redux';
import { fetchMessages, setMessages } from "../../redux/messagesSlice";
import "./MessageBox.scss";
import { IMessage } from "../../interfaces/IMessage";
import { useSelector } from "react-redux";
import { AxiosError } from "axios";
import { Snackbar } from "@mui/material";
import { IMessagesPayload } from "../../interfaces/IMessagePayload";

type ChannelId = {
    channelId: string
  }

export default function MessageBox ( { channelId } : ChannelId) {
    const messageService = new MessageService();
    const authStatus = useSelector((state:any) => state.auth);
    const stateMessages = useSelector((state:any) => state.messages);
    const messages = useSelector((state:any) => state.messages.data[channelId]);
    // console.log(messagesFromRedux)
    // const [messages, setAllMessages] = useState<IMessage[]>([]);
    const [getMessagesError, setGetMessagesError] = useState<{isError: boolean, errorMessage: string}>({isError:false, errorMessage:''});
    const dispatch = useDispatch();


    // const getMessages = async () => {
    //     try {
    //         const response = await messageService.getMessagesByChannelId(channelId);
    //         if(response.isSucceed) {
    //             const messages = response.result;
    //             // const {channelId, response.result as IMessage[] }: IMessagesPayload;
    //             setAllMessages(messages)
    //             dispatch(setMessages({channelId, messages}));
    //         }
    //     } catch (error) {
    //         let errorMessage:string;
    //         if(error instanceof AxiosError) {
    //             errorMessage = error.response?.data.message;
    //         } else {
    //             errorMessage = 'une erreur est survenue, veuillez réessayer';
    //         }
    //         setGetMessagesError({isError: true, errorMessage});
    //     }
    // }

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
            // if(response.isSucceed){
            //     await getMessages();
            // }
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
        if(stateMessages.status === "idle") {
          dispatch<any>(fetchMessages(channelId));
        }
    },[stateMessages.status, dispatch])
    
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