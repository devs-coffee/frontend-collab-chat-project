import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Stack } from "@mui/material";

import { User } from "../../../interfaces/IUser";

import IoSocketContext from "../../../contexts/IoSocketContext";
import { UserItem } from "../../../components";

import "./ServerMembersBox.scss";

interface ServerMemberBoxProps {
	serverUsers: User[];
	compareID: string; 
	joinServer: () => void;
	isDisabled: boolean;
}

export function ServerMembersBox(props: ServerMemberBoxProps): JSX.Element {
	const urlSearchParams = useParams();
	const Socket = useContext(IoSocketContext)!.Socket;
	const authStatus = useSelector((state:any) => state.authStatus);
	const [connectedUsers, setConnectedUsers] = useState<string[]>([authStatus.user.id]);

	useEffect(() => {
		Socket.emit('getServerConnectedUsers', {serverId: urlSearchParams.serverId!});

		Socket.on('serverUserList', (data:{userList: string[]}) => {
            setConnectedUsers(data.userList);
        })

        Socket.on('userJoined', (data: {pseudo: string, id: string}) => {
            console.log(`${data.pseudo} connects`);
            setConnectedUsers([data.id, ...connectedUsers]);
        })

        Socket.on('userLeft', (data: {pseudo: string, id: string}) => {
            console.log(`${data.pseudo} left`);
            setConnectedUsers(connectedUsers.filter(elt => elt !== data.id));
        })

        return () => {
            Socket.off('serverUserList');
            Socket.off('userJoined');
            Socket.off('userLeft');
        }

      }, [urlSearchParams, connectedUsers]
	);

	
	return (
		<div className="members">
			<h4 className="heading">Users :</h4>
			<Stack className="stack" spacing={0.8}>
				{props.serverUsers.map(user => (
					<UserItem key={`userBadge_${user.id}`} user={user} isConnected={connectedUsers.includes(user.id)}/>
				))}
			</Stack>

			{props.serverUsers.length > 0 && (
				<button className="joinOrLeaveButton" onClick={props.joinServer} disabled={props.isDisabled}>
					{props.serverUsers.some(user => user.id === props.compareID) ? 'leave' : 'join'}
				</button>
			)}
		</div>
	);
}