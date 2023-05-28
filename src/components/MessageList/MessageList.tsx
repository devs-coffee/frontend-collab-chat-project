import { IMessage } from '../../interfaces/IMessage';
import './MessageList.scss';
import Message from '../Message/Message';
import { useEffect, useRef, useState } from 'react';
import { MessageService } from '../../services/messageService';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../../redux/messagesSlice';
import { Snackbar } from '@mui/material';
import { AxiosError } from 'axios';

type messageList = {
    messages: IMessage[]
}

const MessageList = ({messages}: messageList) => {
  const messageEndRef = useRef<null | HTMLDivElement>(null); 
  const element = useRef<null | HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const dispatch = useDispatch();
  const stateMessages = useSelector((state:any) => state.messages);
  const [messageError, setMessageError] = useState<{isError:boolean, errorMessage:string}>({isError:false, errorMessage:''});

  useEffect(() => {
    shouldAutoScroll && messageEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end"
    })
  },[messages, stateMessages.status, dispatch])

  const handleToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if(reason === 'clickaway') {
        return;
    }
    setMessageError({isError:false, errorMessage:''});
  }
  
  const getNextMessages = async () => {
    try {
      const response = await new MessageService().getMessagesByChannelId(messages[0].channelId!, messages[0].id!);
      if (response.isSucceed) {;
        messages = response.result.concat(messages);
        dispatch(setMessages({channelId: messages[0].channelId! , messages: messages}));
      }
    } catch (error) {
      let errorMessage:string = 'Une erreur est survenue, veuillez réessayer';
      if(error instanceof AxiosError) {
          errorMessage = error.response?.data.message;
      }
      setMessageError({isError:true, errorMessage});

    }
  }

  const handleScroll = () => {
    if (element.current?.scrollTop === 0 && messages.length > 0) {
      getNextMessages();
      setShouldAutoScroll(false);
    }
  };

  return (
    <div ref={element} className="MessageList" onScroll={handleScroll}>
      {messages && messages.map((message, index) => (
        <div key={message.id}>
          <Message key={message.id} message={message} />
          {index === messages.length - 1 && <div ref={messageEndRef} />}
        </div>
      ))}  
        <Snackbar 
            open={messageError.isError}
            autoHideDuration={4000}
            onClose={handleToastClose}
            message={messageError.errorMessage}
        />  
      </div>

  );
}
export default MessageList;