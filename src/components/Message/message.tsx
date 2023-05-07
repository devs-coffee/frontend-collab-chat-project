import { useEffect, useState } from 'react';
import { MessageService } from '../../services/messageService';
import { IMessage } from '../../interfaces/IMessage';
import { useSelector } from 'react-redux';
import { Avatar, Snackbar } from '@mui/material';
import { AxiosError } from 'axios';
import './message.scss';

type message = {
  channelId: string
}

const Message = ( { channelId } : message) => {
    const authStatus = useSelector((state:any) => state.auth);
    const messageService = new MessageService();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [messageToSend, setMessageToSend] = useState<string>('');
    const [getMessagesError, setGetMessagesError] = useState<{isError: boolean, errorMessage: string}>({isError:false, errorMessage:''});

    const getMessages = async () => {
        console.log('message.tsx : ', channelId);
        try {
            const response = await messageService.getMessagesByChannelId(channelId);
            if(response.isSucceed) {
                console.log(response.result);
                setMessages(response.result);
            }
        } catch (error) {
            let errorMessage:string;
            if(error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            } else {
                errorMessage = 'une erreur est survenue, veuillez réessayer';
            }
            setGetMessagesError({isError: true, errorMessage});
        }
    }

    const sendMessage = async () => {
        if(messageToSend === '') {
            return;
        }
        try {
            const message: IMessage = {
                userId: authStatus.user.id,
                channelId: channelId,
                content: messageToSend
            }
            const response = await messageService.send(message);
            if(response.isSucceed){
                setMessageToSend('');
                await getMessages();
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

    async function handleKeypress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            await sendMessage();
        }
    }

    const handleToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if(reason === 'clickaway') {
            return;
        }
        setGetMessagesError({isError:false, errorMessage:''});
    }
    
    useEffect(() => {
        getMessages()
    }, []);
    
  return (
    <div className="Message">
        {messages && messages.map((message : IMessage) => {
            return <div>
                <div className='message' key={`message=${message.id}`}>
                    {message.user?.picture && message.user.picture !== ''
                    ? <Avatar alt="user picture" src={message.user.picture}></Avatar>  
                    : <Avatar alt="user picture">{message.user?.pseudo.substring(0,1).toUpperCase()}</Avatar>}
                    <p className="message_pseudo">{message.user?.pseudo}</p>
                </div>
                <p key={message.id}>{message.content}</p>
            </div>


        })} 
        <div>
            <input onKeyUp={handleKeypress} onChange={(e) => setMessageToSend(e.target.value)} placeholder='Ecris ton message' type='text' value={messageToSend} />
            <button onClick={sendMessage}>Envoyer</button>
        </div>
        {/* {getMessagesError && getMessagesError !== '' && (<p>{getMessagesError}</p>)} */}
        <Snackbar 
            open={getMessagesError.isError}
            autoHideDuration={4000}
            onClose={handleToastClose}
            message={getMessagesError.errorMessage}
        />
    </div>
  );
}

export default Message;
