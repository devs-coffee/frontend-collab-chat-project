import { AxiosError } from 'axios';
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
  const [messageError, setMessageError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });
  const [markAsReadError, setMarkAsReadError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });

  useEffect(() => {
    if(element.current?.scrollHeight! === element.current?.offsetHeight!) {
      //* scroled to bottom, mark as read
      try {
        new ChannelService().markAsRead(channelId);
      } catch(error) {
        let errorMessage = 'une erreur est survenue, veuillez réessayer';
        if(error instanceof AxiosError) {
          errorMessage = error.response?.data.message;
        }
        setMarkAsReadError({ isError: true, errorMessage });
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
      let errorMessage: string = 'Une erreur est survenue, veuillez réessayer';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data.message;
      }
      setMessageError({ isError: true, errorMessage });
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
        open={messageError.isError}
        setCallbackClose={() => setMessageError({ isError: false, errorMessage: '' })}
        message={messageError.errorMessage}
      />
      <MessageError
        open={markAsReadError.isError}
        setCallbackClose={() => setMarkAsReadError({ isError: false, errorMessage: '' })}
        message={markAsReadError.errorMessage}
      />
    </div>
  );
}
