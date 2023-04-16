import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Avatar } from "@mui/material";
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
    const servers = useSelector((state: any) => state.servers);
    const [server, setServer] = useState<Server | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isUpdatingServer, setIsUpdatingServer] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const urlSearchParams = useParams();
    
    const getServerData = async() => {
        try {
            const response = await serverService.getServerById(urlSearchParams.serverId!)
            if(response.isSucceed) {
                setServer(response.result);
            }
            else {
                console.log(response.errorMessage);
            }
        } catch (error) {
            console.log(error);
            return;
        }
    }

    const getServerUsers = async () => {
        try {
            const response = await serverService.getServerUsers(urlSearchParams.serverId!);
            if(response.isSucceed) {
                setUsers(response.result);
            }
            else {
                console.log(response.errorMessage);
            }
        } catch (error) {
            console.log(error);
            return;
        }
    }

    const joinServer = async () => {
        try {
            setIsDisabled(true);
            const response = await serverService.joinServer(urlSearchParams.serverId!);
            if(response.isSucceed) {
                console.log(response);
                response.result ? dispatch(addServer(server)) : dispatch(removeServer(server?.id));
                getServerUsers();
                setIsDisabled(false)
            }
            else {
                console.log(response.errorMessage);
            }
        } catch (error) {
            console.log(error);
            return;
        }
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
                <p>users: {users.map(user => (`| ${user.pseudo} `))}</p>
                {users.length > 0 && (
                    <button className="joinOrLeaveButton" onClick={joinServer} disabled={isDisabled}>
                        {users.map(u => u.pseudo).includes(authStatus.user.pseudo) ? 
                            ("leave")
                            :
                            ("join")
                        }
                    </button>
                )}
                </>
            )}
            {server && isUpdatingServer && (<ServerUpdateForm setIsUpdatingServer={setIsUpdatingServer} server={server}/>)}
        </div>
    )
}