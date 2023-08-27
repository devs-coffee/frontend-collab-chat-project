import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { ServerHeading, ServerChat, ServerChannelBox, ServerMembersBox, ServerUpdateForm, MessageError } from "../../components";
import { reduxData } from "../../interfaces/IReduxData";
import { Server } from "../../interfaces/IServer";
import { addOrUpdateServer } from "../../redux/serversSlice";
import { ServerService } from "../../services/serverService";

import './ServerDisplay.scss';

const getServerData = async (serverId: string) => {
    try {
        const response = await new ServerService().getServerById(serverId);
        return response.result;
    } catch (error) {
        let errorMessage: string = 'Données du serveur non récupérées, veuillez réessayer';
        if (error instanceof AxiosError) {
            errorMessage = error.response?.data.message;
        }
        throw new Error(errorMessage);
    }
}

export function ServerDisplay() {
    const dispatch = useDispatch();
    const urlSearchParams = useParams();
    const server = useSelector((state: reduxData) => state.servers.data.find((server: Server) => server.id === urlSearchParams.serverId));
    const [isUpdatingServer, setIsUpdatingServer] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string>('');
    const [mainContent, setMainContent] = useState<string>('chat');
    const [channelId, setChannelId] = useState<string>("");

    const avoidManagingChannel = () => {
        setMainContent('chat');
    }

    useEffect(() => {
        if (channelId === "") {
            getServerData(urlSearchParams.serverId!)
                .then(response => {
                    dispatch(addOrUpdateServer(response));
                    const channels = response.channels;
                    const defaultChannel = channels[0];
                    setChannelId(defaultChannel.id);
                })
                .catch(error => {
                    setServerError(error);
                });
        }
    }, [urlSearchParams]);

    return (
        <div className="ServerDisplay">
            {server === undefined ? <p>Patientez</p>
                :
                <>
                    <ServerHeading
                        title={server.name}
                        picture={server.picture}
                        admin={server.isCurrentUserAdmin}
                        setIsUpdatingServer={setIsUpdatingServer}
                    />
                    <div className="ServerDisplay__main-content">
                        <ServerChannelBox
                            channels={server.channels}
                            admin={server.isCurrentUserAdmin}
                            setChannelId={setChannelId}
                            setMainContent={setMainContent}
                        />
                        <ServerChat
                            channels={server.channels}
                            content={mainContent}
                            channelID={channelId}
                            currentUser={server.isCurrentUserMember}
                            avoidManagingChannel={avoidManagingChannel}
                        />
                        {channelId !== '' && <ServerMembersBox />}
                    </div>
                </>
            }
            {server && isUpdatingServer && (<ServerUpdateForm setIsUpdatingServer={setIsUpdatingServer} server={server} />)}

            <MessageError
                open={serverError !== ''}
                setCallbackClose={() => setServerError('')}
                message={serverError}
            />
        </div>
    )
}