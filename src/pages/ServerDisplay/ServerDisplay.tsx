import { AxiosError } from "axios";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import SettingsIcon from '@mui/icons-material/Settings';
import { Avatar, Snackbar, Stack } from "@mui/material";

import ChannelManager from "../../components/ChannelManager/ChannelManager";
import MessageBox from "../../components/MessageBox/MessageBox";
import ServerUpdateForm from "../../components/ServerUpdateForm/ServerUpdateForm";
import { ChannelBase } from "../../interfaces/IChannel.base";
import { reduxData } from "../../interfaces/IReduxData";
import { Server } from "../../interfaces/IServer";
import { User } from "../../interfaces/IUser";
import { addOrUpdateServer } from "../../redux/serversSlice";
import { addUsers } from "../../redux/usersSlice";
import { ServerService } from "../../services/serverService";

import './ServerDisplay.scss';

const getServerData = async(serverId: string) => {
    try {
        const response = await new ServerService().getServerById(serverId);
        return response.result;

    } catch (error) {
        let errorMessage: string = 'Données du serveur non récupérées, veuillez réessayer';
        if(error instanceof AxiosError) {
            errorMessage = error.response?.data.message;
        }
        throw new Error(errorMessage);
    }
}

const getServerUsers = async (serverId: string) => {
    try {
        const response = await new ServerService().getServerUsers(serverId);
        return response.result;
    } catch (error) {
        let errorMessage = "membres du serveur non récupérés, veuillez réessayer";
        if(error instanceof AxiosError) {
            errorMessage = error.response?.data.message;
        }
        throw new Error(errorMessage);
    }
}

export default function ServerDisplay() {
    const dispatch = useDispatch();
    const authStatus = useSelector((state:any) => state.authStatus);
    const usersState = useSelector((state:any) => state.users);
    const urlSearchParams = useParams();
    const server = useSelector((state:reduxData) => state.servers.data.find((server:Server) => server.id === urlSearchParams.serverId));
    const [serverUsers, setServerUsers] = useState<User[]>([]);
    const [isUpdatingServer, setIsUpdatingServer] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string>('');
    const [usersError, setUsersError] = useState<string>('');
    const [joinServerError, setJoinServerError] = useState<{isError:boolean, errorMessage:string}>({isError: false, errorMessage: ''});
    const [mainContent, setMainContent] = useState<string>('chat');
    const [channelId, setChannelId] = useState<string>("");
    
    const joinServer = async () => {
        try {
            setIsDisabled(true);
            const response = await new ServerService().joinServer(urlSearchParams.serverId!);
            const newServer = {...server};
            newServer.isCurrentUserMember = response.result
            dispatch(addOrUpdateServer(newServer));
            const serverData = await getServerUsers(urlSearchParams.serverId!)
            let usersToAdd: User[] = [];
            serverData.forEach((elt: User) => {
                if(!usersState.data.find((user: User) => user.id === elt.id) && elt.id !== authStatus.user.id) {
                    usersToAdd.push(elt);
                }
            })
            dispatch(addUsers(usersToAdd));
            setServerUsers(serverData);
            setIsDisabled(false)
        } catch (error) {
            let errorMessage:string;
            if(error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            } else {
                errorMessage = 'une erreur est survenue, veuillez réessayer';
            }
            setJoinServerError({isError: true, errorMessage});
            return;
        }
    }

    const handleDataToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if(reason === 'clickaway') {
            return;
        }
        setServerError('');
        setUsersError('');
    }

    const handleJoinToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if(reason === 'clickaway') {
            return;
        }
        setJoinServerError({isError:false, errorMessage:''});
    }

    const getFullError = ():ReactNode => {
        return (
            <>
                {!server && (serverError)}
                {!server && serverUsers.length < 1 && (<br/>)}
                {serverUsers.length <1 && (usersError)}
            </>
        )
    }

    const updateChannels = () => {
        setMainContent('updateChannel');
    }

    const avoidManagingChannel = () => {
        setMainContent('chat');
    }

    const redirectToChannel = (toChannelId: string) => {
        setChannelId(toChannelId);
    }

    useEffect(() => {
        getServerData(urlSearchParams.serverId!)
            .then(response => {
                dispatch(addOrUpdateServer(response));
                const channels = response.channels;
                const defaultChannel = channels[0];
                setChannelId(defaultChannel.id);
            })
            .catch(error => {
                setUsersError(error);
            });
        getServerUsers(urlSearchParams.serverId!)
            .then(response => {
                let usersToAdd: User[] = [];
                response.forEach((elt: User) => {
                    if(!usersState.data.find((user: User) => user.id === elt.id) && elt.id !== authStatus.user.id) {
                        usersToAdd.push(elt);
                    }
                });
                dispatch(addUsers(usersToAdd));
                setServerUsers(response);
            })
            .catch(error => {
                setServerError(error);
            });
    }, [urlSearchParams, authStatus, dispatch, usersState.data]);
    
    return (
        <div className="ServerDisplay">
            {server === undefined ? <p>Patientez</p> 
                :
                <>
                <div className="server-heading">
                    {server.picture ? 
                        (<Avatar alt="avatar server" src={server.picture} />)
                        :
                        (<Avatar>{server.name?.substring(0, 1).toUpperCase()}</Avatar>)
                    }
                    <h3>{server.name}</h3>
                    {server?.isCurrentUserAdmin && 
                        <SettingsIcon onClick={() => setIsUpdatingServer(true)} />
                    }
                </div>
                <div className="ServerDisplay__main-content">
                    <div className="ServerDisplay__main-content__channels-box">
                        <h4>
                            Channels :
                            {server?.channels && server.isCurrentUserAdmin && (
                                <SettingsIcon fontSize={"inherit"} onClick={() => updateChannels()} />
                            )}
                        </h4>
                        <Stack className="channels-stack" spacing={0.8}>
                            {server?.channels && (
                            server.channels.map((channel:ChannelBase) => (
                                <span className="channels-stack__items" key={`span-${channel.id}`}>
                                    <p className="channel-title" onClick={() => redirectToChannel(channel.id)}>{channel.title}</p>
                                </span>
                            ))
                        )}
                        </Stack>
                    </div>
                    {mainContent === 'chat' && (
                        <div className="ServerDisplay__main-content__middle-box">
                            <h4>Chat-box</h4>
                            {channelId && channelId !== '' && <MessageBox channelId={channelId} canUserPost={server.isCurrentUserMember} key={channelId} />}
                        </div>
                    )}
                    {mainContent === 'updateChannel' && (
                        <div className="ServerDisplay__main-content__middle-box">
                            <ChannelManager  channels={server.channels} avoidManaging={avoidManagingChannel}/>
                        </div>
                    )}
                    <div className="ServerDisplay__main-content__members-box">
                        <h4 className="members-heading">Users :</h4>
                        <Stack className="members-stack" spacing={0.8}>
                            {serverUsers.map(user => (
                                <Link key={`link-${user.id}`} to={`/user/${user.id}`}>{user.pseudo}</Link>
                            ))}
                        </Stack>
                        {serverUsers.length > 0 && (
                            <button className="joinOrLeaveButton" onClick={joinServer} disabled={isDisabled}>
                                {serverUsers.some(user => user.id === authStatus.user.id) ? 'leave' : 'join'}
                            </button>
                        )}
                    </div>
                </div>
                </>
            }
            {server && isUpdatingServer && (<ServerUpdateForm setIsUpdatingServer={setIsUpdatingServer} server={server}/>)}
            <Snackbar
                open={serverError !== '' || usersError !== ''}
                autoHideDuration={4000}
                onClose={handleDataToastClose}
                message={getFullError()}
            />
            <Snackbar 
                open={joinServerError.isError}
                autoHideDuration={4000}
                onClose={handleJoinToastClose}
                message={joinServerError.errorMessage}
            />
        </div>
    )
}