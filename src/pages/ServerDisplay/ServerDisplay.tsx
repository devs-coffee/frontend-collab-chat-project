import { ReactNode, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AxiosError } from "axios";

import { Avatar, Snackbar } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';

import ServerUpdateForm from "../../components/ServerUpdateForm/ServerUpdateForm";
import { User } from "../../interfaces/IUser";
import { Server } from "../../interfaces/IServer";
import { ServerService } from "../../services/serverService";
import { addServer, removeServer } from "../../redux/serversSlice";

import './ServerDisplay.scss';

const serverService = new ServerService();

export default function ServerDisplay() {
    const dispatch = useDispatch();
    const authStatus = useSelector((state:any) => state.auth);
    const [server, setServer] = useState<Server | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isUpdatingServer, setIsUpdatingServer] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string>('');
    const [usersError, setUsersError] = useState<string>('');
    const [ joinServerError, setJoinServerError ] = useState<{isError:boolean, errorMessage:string}>({isError: false, errorMessage: ''});
    
    const urlSearchParams = useParams();
    
    const getServerData = async() => {
        try {
            const response = await serverService.getServerById(urlSearchParams.serverId!)
            setServer(response.result);
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
            console.log(error);
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

    useEffect(() => {
        getServerData();
        getServerUsers();
    }, []);
    
    return (
        <div className="ServerDisplay">
            <h2>Server display works !</h2>
            {server === null && <p>Patientez</p> }
            {server !== null && (
                <>
                <div className="server-heading">
                    {server.picture ? 
                        (<Avatar alt="avatar server" src={server.picture} />)
                        :
                        (<Avatar>{server.name.substring(0, 1).toUpperCase()}</Avatar>)
                    }
                    <h3>{server.name}</h3>
                    {server?.isCurrentUserAdmin && 
                        <SettingsIcon onClick={() => setIsUpdatingServer(true)} />
                    }
                </div>
                <p>users: {users.map(user => (
                    <Link to={`/user/${user.id}`}>| {user.pseudo} </Link>
                ))}</p>
                {users.length > 0 && (
                    <button className="joinOrLeaveButton" onClick={joinServer} disabled={isDisabled}>
                        {users.map(u => u.id).includes(authStatus.user.id) ? 
                            ("leave")
                            :
                            ("join")
                        }
                    </button>
                )}
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