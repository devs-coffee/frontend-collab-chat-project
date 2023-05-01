import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MessageService } from '../../services/messageService';
import { IMessage } from '../../interfaces/IMessage';
import { Avatar } from '@mui/material';


type message = {
//   setMessage? : Dispatch<SetStateAction<boolean>>,
  channelId: string
}


const Message = ( { channelId } : message) => {

    const messageService = new MessageService();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const getMessages = async () => {
        try {
            const response = await messageService.getMessagesByChannelId(channelId);
            if(response.isSucceed) {
                setMessages(response.result);
            }
        } catch (error) {
            
        }
    }
    const sendMessage = async () => {
        try {
            // const message: IMessage = {
            //     userId: authStatus.user.id,
            //     channelId: 
            // }
            // const messageToSend = await messageService.send(message)
        }
        catch(error){
            console.log(error);
        }
    }
    
    const handleChangeMessage = () => {
        
    }
    
    useEffect(() => {
        getMessages()
    }, []);
    
  return (
    <div>
        <>
        {messages && messages.map(message => {
            return <p>{message.content}</p>
        })} 
        </>
    </div>
  );
}

export default Message;
