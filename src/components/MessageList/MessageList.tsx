import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MessageService } from '../../services/messageService';
import { ChannelService } from '../../services/channelService';
import { setMessages } from '../../redux/messagesSlice';
import { IMessage } from '../../interfaces/IMessage';
import { MessageError } from '../';
import { MemorisedMessage } from '../';

import './MessageList.scss';

type messageList = {
    messages: IMessage[],
    channelId: string
}

export const MessageList = ({messages, channelId}: messageList) => {
  const messageEndRef = useRef<null | HTMLDivElement>(null); 
  const element = useRef<null | HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const dispatch = useDispatch();
  const stateMessages = useSelector((state: any) => state.messages);
  const [messageError, setMessageError] = useState<string>('');

  useEffect(() => {
    if(element.current?.scrollHeight! === element.current?.offsetHeight!) {
      //* scroled to bottom, mark as read
      try {
        new ChannelService().markAsRead(channelId);
      } catch(error) {
        const errorMessage = error as Error;
        setMessageError(errorMessage.message);
      }
    }
    shouldAutoScroll && messageEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end"
    })
  }, [messages, stateMessages.status, dispatch, shouldAutoScroll])

  const getNextMessages = async () => {
    try {
      const response = await new MessageService().getMessagesByChannelId(messages[0].channelId!, messages[0].id!);
      if (response.isSucceed) {
        messages = response.result.concat(messages);
        dispatch(setMessages({ channelId: messages[0].channelId!, messages: messages }));
      }
    } catch (error) {
      const errorMessage = error as Error;
      setMessageError(errorMessage.message);
    }
  }

  const handleScroll = () => {
    const elt = element.current;
    if (elt?.scrollTop === 0 && messages.length > 0) {
      getNextMessages();
      setShouldAutoScroll(false);
    }
    if(elt?.scrollTop === elt?.scrollHeight! - elt?.offsetHeight!) {
      //TODO When initial scroll will point to first unread message
      //* scroled to bottom, mark as read
    }
  };

  return (
    <div ref={element} className="MessageList" onScroll={handleScroll}>
      {messages && messages.map((message, index) => (
        <div key={message.id}>
          <MemorisedMessage key={message.id} message={message} />
          {index === messages.length - 1 && <div ref={messageEndRef} />}
        </div>
      ))}

      <MessageError
        open={messageError !== ''}
        setCallbackClose={() => setMessageError('')}
        message={messageError}
      />
    </div>
  );
}
