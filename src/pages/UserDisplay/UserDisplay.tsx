import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { useSelector } from "react-redux";

import { Avatar } from "@mui/material";

import { User } from "../../interfaces/IUser";
import { reduxData } from "../../interfaces/IReduxData";
import { UserService } from "../../services/userService";
import { MessageService } from "../../services/messageService";
import { MessageEditor, MessageError } from "../../components";

import './UserDisplay.scss';

export function UserDisplay() {
    const urlSearchParams = useParams();
    const messageService = new MessageService();
    const userId = useSelector((state: reduxData) => state.authStatus.user?.id);
    const [displayedUser, setDisplayedUser] = useState<User | null>(null);
    const [isSendingPM, setIsSendingPM] = useState<boolean>(false);
    const [getUserError, setGetUserError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });
    const [sendMessageError, setSendMessageError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });

    const sendPrivateMessage = async (messageContent: string) => {
        let message = {
            userId: userId!,
            toUserId: urlSearchParams.userId!,
            content: messageContent
        }
        
        try {
            await messageService.send(message);
        } catch (error) {
            let errorMessage: string = 'une erreur est survenue, veuillez réessayer';;
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            }
            setSendMessageError({ isError: true, errorMessage });
        }
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await new UserService().getUser(urlSearchParams.userId!);
                if (response.isSucceed) {
                    setDisplayedUser(response.result);
                    return response.result;
                }
            } catch (error) {
                let errorMessage: string = 'une erreur est survenue, veuillez réessayer';;
                if (error instanceof AxiosError) {
                    errorMessage = error.response?.data.message;
                }
                setGetUserError({ isError: true, errorMessage });
                }
        }
        getUser();
    }, [urlSearchParams])

    return (
        <div className="UserDisplay">
            <div className="heading">
                {displayedUser?.picture ?
                    (<Avatar alt="avatar membre" src={displayedUser.picture} />)
                    :
                    (<Avatar alt="avatar membre">{displayedUser?.pseudo.substring(0, 1).toUpperCase()}</Avatar>)
                }
                <h3>{displayedUser?.pseudo}</h3>
            </div>
            <button onClick={() =>setIsSendingPM(true)}>Envoyer message</button>
            <p className="temp-content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet iure quo aspernatur illum atque libero quam rem quia quaerat exercitationem minima cupiditate eum, necessitatibus blanditiis ut soluta facilis est dolore?</p>
            {isSendingPM && (
                <MessageEditor sendMessage={sendPrivateMessage}/>
            )}
            <MessageError
                open={sendMessageError.isError}
                setCallbackClose={() => setSendMessageError({ isError: false, errorMessage: '' })}
                message={sendMessageError.errorMessage}
            />
            <MessageError
                open={getUserError.isError}
                setCallbackClose={() => setGetUserError({ isError: false, errorMessage: '' })}
                message={getUserError.errorMessage}
            />
        </div>
    )
}