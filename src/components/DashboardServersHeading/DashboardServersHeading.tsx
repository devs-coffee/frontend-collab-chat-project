import React, { useState, useEffect } from 'react';

import { Server } from '../../interfaces/IServer';
import { ServerService } from '../../services/serverService';

import './DashboardServersHeading.scss';

type DashboardServersHeadingProps = {
    addingServer: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DashboardServersHeading(props:DashboardServersHeadingProps) {
    const serverService = new ServerService();
    const [servers, setServers] = useState<Server[]>([]);
    const [isDataLoading, setDataLoading] = useState<boolean>(true);
    const addNewServer = () => props.addingServer(true);

    useEffect(() => {
        setDataLoading(true);
        getServers()
        .then(data => {
            if(data) {
                setServers(data);
            }
            setDataLoading(false);
            
        })
    }, [])

    async function getServers():Promise<Server[] | null> {
        try {
            const response = await serverService.getServers();
            if(response.isSucceed) {
                return response.result;
            }
            return null;
        } catch (error) {
            return null;
        }
    }
    

    return (
        <div className="DashboardServersHeading">
            <h3>Servers heading works !</h3>
            {
                isDataLoading ? (<span>Veuillez patienter</span>) :
                servers.map((server:Server) => (server.name))
            }
            <button onClick={addNewServer}>Ajouter Serveur</button>
        </div>
    )
}