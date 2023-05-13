import { Avatar } from '@mui/material';
import { IMessage } from '../../interfaces/IMessage';
import './Message.scss';
import { useState } from 'react';
import MessageEditor from '../MessageEditor/MessageEditor';
import Actions from '../commons/Actions';
import { useSelector } from 'react-redux';

type messageType = {
    message: IMessage
}

export default function  Message({message}: messageType)  {
    const currentDate = new Date(Date.now()).toLocaleString('fr', { dateStyle : 'long' });
    const messageDate = new Date(message.createdAt!).toLocaleString('fr', {dateStyle: 'long'});
    const isToday = currentDate === messageDate;
    const [isEdit, setIsEdit] = useState(false);
    const authStatus = useSelector((state:any) => state.auth);

    const sendMessage = async (message: string) => {
        setIsEdit(false)
        return message
    }

    const triggerAction = (action: string) => {
        console.log(action)
        if(action === 'Modifier') {
            setIsEdit(true)

        }
        else if (action === 'Supprimer') {

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