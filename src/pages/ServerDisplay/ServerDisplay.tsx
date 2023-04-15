import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Avatar } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';

import ServerUpdateForm from "../../components/ServerUpdateForm/ServerUpdateForm";
import { User } from "../../interfaces/IUser";
import { Server } from "../../interfaces/IServer";
import { ServerService } from "../../services/serverService";

import './ServerDisplay.scss';

const serverService = new ServerService();

export default function ServerDisplay() {
    const [server, setServer] = useState<Server | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isUpdatingServer, setIsUpdatingServer] = useState<boolean>(false);
    
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

    useEffect(() => {
        if(!server) {
            getServerData();
        }
        if(users.length < 1) {
            getServerUsers();
        }
    }, [ users, server ]);
    
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
                </>
            )}
            {server && isUpdatingServer && (<ServerUpdateForm setIsUpdatingServer={setIsUpdatingServer} server={server}/>)}
        </div>
    )
}