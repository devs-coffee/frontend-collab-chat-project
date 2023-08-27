import { AxiosError } from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Avatar } from '@mui/material';
import parse, { Element } from 'html-react-parser';
import { IMessage } from '../../interfaces/IMessage';
import { reduxData } from '../../interfaces/IReduxData';
import { removeMessage, updateMessage } from '../../redux/messagesSlice';
import { MessageService } from '../../services/messageService';
import { MessageEditor, Actions, MessageError } from '../';

import './Message.scss';

type messageType = {
    message: IMessage
}

export function Message({ message }: messageType) {
    const currentDate = new Date(Date.now()).toLocaleString('fr', { dateStyle: 'long' });
    const messageDate = new Date(message.createdAt!).toLocaleString('fr', { dateStyle: 'long' });
    const isToday = currentDate === messageDate;
    const [isEdit, setIsEdit] = useState(false);
    const authStatus = useSelector((state: reduxData) => state.authStatus);
    const users = useSelector((state: reduxData) => state.users.data);
    const author = message.userId === authStatus.user!.id ? authStatus.user : users.find(user => user.id === message.userId);
    const dispatch = useDispatch();
    const [getMessagesError, setGetMessagesError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });


    const sendMessage = async (content: string) => {
        setIsEdit(false)
        update(content)
    }

    const parser = (input: string) =>
        parse(input, {
            replace: domNode => {
                if (domNode instanceof Element && domNode.attribs.class === 'remove') {
                    return <></>;
                }
            }
        });


    const triggerAction = (action: string) => {
        if (action === 'Modifier') {
            setIsEdit(true)
        }
        if (action === 'Supprimer') {
            remove(message.id!);
        }
        if (action === "Annuler") {
            setIsEdit(false);
        }
    }

    const remove = async (id: string) => {
        try {
            const response = await new MessageService().remove(id);
            if (response.isSucceed) {
                dispatch<any>(removeMessage(message));
            }
        } catch (error) {
            let errorMessage: string;
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            } else {
                errorMessage = 'une erreur est survenue, veuillez réessayer';
            }
            setGetMessagesError({ isError: true, errorMessage });
        }
    }

    const update = async (content: string) => {
        try {
            const response = await new MessageService().update(message.id!, { content });
            if (response.isSucceed) {
                dispatch<any>(updateMessage(response.result));
            }
        } catch (error) {
            let errorMessage: string;
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            } else {
                errorMessage = 'une erreur est survenue, veuillez réessayer';
            }
            setGetMessagesError({ isError: true, errorMessage });
        }
    }

    return (
        <div className="Message">
            <div className='message'>
                {author && author?.picture && author?.picture !== ''
                    ? <Avatar alt="user picture" src={author!.picture}></Avatar>
                    : <Avatar alt="user picture">{message.user?.pseudo.substring(0, 1).toUpperCase()}</Avatar>}
                <p className="message_pseudo">{message.user?.pseudo} <span className='message_date'>{isToday ? "Aujourd'hui" : 'le ' + messageDate} à {new Date(message.createdAt!).getHours()}:{new Date(message.createdAt!).getMinutes()}</span></p>
            </div>

            {!isEdit
                ? <div className="message_content">
                    <p key={message.id}>{parser(message.content)}</p>
                    {authStatus!.user!.id === message.userId && <span><Actions actionHandler={(action: string) => triggerAction(action)} availableActions={['Modifier', 'Supprimer']} /></span>}
                </div>
                : <div className="message_content">
                    <MessageEditor messageContent={message.content} sendMessage={sendMessage} />
                    <span>
                        <Actions actionHandler={(action: string) => triggerAction(action)} isShow={true} availableActions={['Annuler']} />
                    </span>
                </div>
            }
            <MessageError
                open={getMessagesError.isError}
                setCallbackClose={() => setGetMessagesError({ isError: false, errorMessage: '' })}
                message={getMessagesError.errorMessage}
            />
        </div>
    );
}