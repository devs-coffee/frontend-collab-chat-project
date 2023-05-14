import { IMessage } from '../../interfaces/IMessage';
import './MessageList.scss';
import Message from '../Message/Message';

type messageList = {
    messages: IMessage[]
}

export default function  MessageList( { messages } : messageList)  {
  return (
    <div className="MessageList">
        {messages && messages.map((message) => <Message message={message}/>)}
    </div>
  );
}