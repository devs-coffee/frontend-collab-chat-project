import { AxiosError } from "axios";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import SettingsIcon from '@mui/icons-material/Settings';
import { Avatar, Snackbar, Stack } from "@mui/material";

import ServerUpdateForm from "../../components/ServerUpdateForm/ServerUpdateForm";
import ChannelManager from "../../components/ChannelManager/ChannelManager";
import { User } from "../../interfaces/IUser";
import { ChannelBase } from "../../interfaces/IChannel.base";
import { addServer, removeServer, updateServer } from "../../redux/serversSlice";
import { ServerService } from "../../services/serverService";
import './ServerDisplay.scss';
import Message from "../../components/Message/message";

const serverService = new ServerService();

export default function ServerDisplay() {
    const dispatch = useDispatch();
    const authStatus = useSelector((state:any) => state.auth);
    const urlSearchParams = useParams();
    const server = useSelector((state:any) => state.servers.data.find((server:any) => server.id === urlSearchParams.serverId));
    const [users, setUsers] = useState<User[]>([]);
    const [isUpdatingServer, setIsUpdatingServer] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string>('');
    const [usersError, setUsersError] = useState<string>('');
    const [ joinServerError, setJoinServerError ] = useState<{isError:boolean, errorMessage:string}>({isError: false, errorMessage: ''});
    const [mainContent, setMainContent] = useState<string>('chat');
    const [channelId, setChannelId] = useState<string>("");
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const getServerData = async() => {
        try {
            const response = await serverService.getServerById(urlSearchParams.serverId!)
            dispatch(updateServer(response.result));
        } catch (error) {
            setServerError('Données du serveur non récupérées, veuillez réessayer');
            if(error instanceof AxiosError) {
                setServerError(error.response?.data.message);
            }
            return;
        }
    }

    const getServerUsers = async () => {
        try {
            const response = await serverService.getServerUsers(urlSearchParams.serverId!);
            setUsers(response.result);
        } catch (error) {
            setUsersError('membres du serveur non récupérés, veuillez réessayer');
            if(error instanceof AxiosError) {
                setUsersError(error.response?.data.message);
            }
            return;
        }
    }

    const joinServer = async () => {
        try {
            setIsDisabled(true);
            const response = await serverService.joinServer(urlSearchParams.serverId!);
            response.result ? dispatch(addServer(server)) : dispatch(removeServer(server?.id));
            getServerUsers();
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
                {!server && users.length < 1 && (<br/>)}
                {users.length <1 && (usersError)}
            </>
        )
    }

    const updateChannels = () => {
        setMainContent('updateChannel');
    }

    const avoidManagingChannel = () => {
        setMainContent('chat');
    }

    const redirectToChannel = (channelId: string) => {
        setChannelId(channelId);
        setShowMessage(true);
    }

    useEffect(() => {
        getServerData();
        getServerUsers();
    }, []);
    
    return (
        <div className="ServerDisplay">
            {server === null && <p>Patientez</p> }
            {server !== null && (
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
                                    <p onClick={() => redirectToChannel(channel.id)}>{channel.title}</p>
                                </span>
                            ))
                        )}
                        </Stack>
                    </div>
                    {mainContent === 'chat' && (
                        <div className="ServerDisplay__main-content__middle-box">
                        <h4>Chat-box</h4>
                        {showMessage && <Message channelId={channelId} />}
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
                            {users.map(user => (
                                <Link key={`link-${user.id}`} to={`/user/${user.id}`}>{user.pseudo}</Link>
                            ))}
                        </Stack>
                        {users.length > 0 && (
                            <button className="joinOrLeaveButton" onClick={joinServer} disabled={isDisabled}>
                                {users.map(u => u.id).includes(authStatus.user.id) ? 
                                    ("leave")
                                    :
                                    ("join")
                                }
                            </button>
                        )}
                    </div>
                </div>
                </>
            )}
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