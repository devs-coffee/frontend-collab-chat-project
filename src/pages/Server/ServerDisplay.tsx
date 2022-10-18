import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import ServerUpdateForm from "../../components/ServerUpdateForm/ServerUpdateForm";
import { Server } from "../../interfaces/IServer";
import { User } from "../../interfaces/IUser";
import { ServerService } from "../../services/serverService";

import './ServerDisplay.scss';
const serverService = new ServerService();

export default function ServerDisplay() {
    const [users, setUsers] = useState<User[]>([]);
    const [isUpdatingServer, setIsUpdatingServer] = useState<boolean>(false);
    
    const params = useParams();
    const servers = useSelector((state:any) => state.servers);
    const server:Server = servers.find((server:Server) => server.id === params.serverId);

    const getServerUsers = async () => {
        try {
            const response = await serverService.getServerUsers(server.id);
            if(response.isSucceed) {
                setUsers(response.result);
            }
        } catch (error) {
            return;
        }
    }

    useEffect(() => {
        if(users.length < 1) {
            getServerUsers();
        }
    }, [users]);
    
    return (
        <div className="ServerDisplay">
            <p>Server display works !<br/>
            server id : {params.serverId} <br/>
            {server.picture && 
                (<span>Avatar :<br/>
                <img className="server-avatar" alt="avatar serveur" src={server.picture} />
                <br/></span>)
            }
            name: {server.name}<br/>
            users: {users.map(user => (`| ${user.pseudo}`))}
            </p>
            <button onClick={() => setIsUpdatingServer(true)}>update</button>
            {isUpdatingServer && (<ServerUpdateForm setIsUpdatingServer={setIsUpdatingServer} server={server}/>)}
        </div>
    )
}