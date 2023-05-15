import { IMessage } from '../../interfaces/IMessage';
import './MessageList.scss';
import Message from '../Message/Message';
import { useEffect, useRef } from 'react';

type messageList = {
    messages: IMessage[],
}

const MessageList = ( { messages} : messageList) => {
  const messageEndRef = useRef<null | HTMLDivElement>(null); 

  useEffect(() => {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth"
      })
    },[messages]);

  return (
    <div className="MessageList">
        {messages && messages.map((message) => <Message message={message}/>)}
        <div ref={messageEndRef} ></div>
    </div>
  );
}
export default MessageList;