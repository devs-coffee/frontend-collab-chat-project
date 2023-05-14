import { Avatar } from '@mui/material';
import { IMessage, IUpdateMessage } from '../../interfaces/IMessage';
import './Message.scss';
import { useState } from 'react';
import MessageEditor from '../MessageEditor/MessageEditor';
import Actions from '../commons/Actions';
import { useDispatch, useSelector } from 'react-redux';
import { MessageService } from '../../services/messageService';
import { AxiosError } from 'axios';
import { removeMessage, updateMessage } from '../../redux/messagesSlice';

type messageType = {
    message: IMessage
}

export default function  Message({message}: messageType)  {
    const currentDate = new Date(Date.now()).toLocaleString('fr', { dateStyle : 'long' });
    const messageDate = new Date(message.createdAt!).toLocaleString('fr', {dateStyle: 'long'});
    const isToday = currentDate === messageDate;
    const [isEdit, setIsEdit] = useState(false);
    const authStatus = useSelector((state:any) => state.auth);
    const dispatch = useDispatch();
    const [getMessagesError, setGetMessagesError] = useState<{isError: boolean, errorMessage: string}>({isError:false, errorMessage:''});

    const sendMessage = async (content: string) => {
        setIsEdit(false)
        update(content)
    }

    const triggerAction = (action: string) => {
        if (action === 'Modifier') {
            setIsEdit(true)
        }
        else if (action === 'Supprimer') {
            remove(message.id!);
        }
    }

    const remove = async (id: string) => {
        try {
            const response = await new MessageService().remove(id);
            if (response.isSucceed) {
                dispatch<any>(removeMessage(message));
            }
        } catch (error) {
            let errorMessage:string;
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            } else {
                errorMessage = 'une erreur est survenue, veuillez réessayer';
            }
            setGetMessagesError({isError: true, errorMessage});
            }
        }

    const update = async(content: string) => {
        try {
            const response = await new MessageService().update(message.id!, { content });
            if (response.isSucceed) {
                dispatch<any>(updateMessage(response.result));
            }
        } catch (error) {
            let errorMessage:string;
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            } else {
                errorMessage = 'une erreur est survenue, veuillez réessayer';
            }
            setGetMessagesError({isError: true, errorMessage});
            }
    }
    
  return (
    <div className="Message">
        <div className='message' key={`message=${message.id}`}>
            {message.user?.picture && message.user.picture !== ''
            ? <Avatar alt="user picture" src={message.user.picture}></Avatar>  
            : <Avatar alt="user picture">{message.user?.pseudo.substring(0,1).toUpperCase()}</Avatar>}
            <p className="message_pseudo">{message.user?.pseudo} <span className='message_date'>{isToday ? "Aujourd'hui" : messageDate} à {new Date(message.createdAt!).getHours()}:{new Date(message.createdAt!).getMinutes()}</span></p>
        </div>

        {!isEdit 
            ? <div>
                    <p key={message.id}>{message.content}</p>
                    {authStatus.user.id === message.userId  && <span><Actions actionHandler={(action:string) => triggerAction(action)} availableActions={['Modifier', 'Supprimer']} /></span>}
                </div>
            : <div>
                    <MessageEditor messageContent={message.content} sendMessage={sendMessage} />
                    <span onClick={() => setIsEdit(false)}>Annuler</span>
                </div>
        }
    </div>
  );
}