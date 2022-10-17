import { useState } from "react";
import { useParams } from "react-router-dom"
import ServerUpdateForm from "../../components/ServerUpdateForm/ServerUpdateForm";

export default function Server() {
    let params = useParams();
    const [isUpdatingServer, setIsUpdatingServer] = useState<boolean>(false);
    return (
        <div className="Server">
            <p>Server display works !<br/>
            server id : {params.serverId} <br/>
            
            </p>
            <button onClick={() => setIsUpdatingServer(true)}>update</button>
            {isUpdatingServer && (<ServerUpdateForm setIsUpdatingServer={setIsUpdatingServer} serverId={params.serverId}/>)}
        </div>

    )
}