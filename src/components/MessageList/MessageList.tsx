import { Avatar } from '@mui/material';
import { IMessage } from '../../interfaces/IMessage';
import './MessageList.scss';

type messageList = {
    messages: IMessage[]
}

export default function  MessageList( { messages } : messageList)  {
    
  return (
    <div className="MessageList">
        {messages && messages.map((message) => {
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
    </div>
  );
}