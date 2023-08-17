import { useContext, useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { User } from "../../../interfaces/IUser";

import IoSocketContext from "../../../contexts/IoSocketContext";
import { UserItem } from "../../../components";

import "./ServerMembersBox.scss";

interface ServerMemberBoxProps {
	userId: string;
	serverId: string;
	serverUsers: User[];
	joinServer: () => void;
	isDisabled: boolean;
	setServerUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export function ServerMembersBox(props: ServerMemberBoxProps): JSX.Element {
	const Socket = useContext(IoSocketContext)!.Socket;
	const [connectedUsers, setConnectedUsers] = useState<string[]>([props.userId]);
	const [hasConnecetdUsers, setHasConnectedUsers] = useState<boolean>(false);

	console.log('render');
	console.log(connectedUsers);
	console.log('value', props.serverUsers);

	useEffect(() => {
		if (!hasConnecetdUsers) {
			Socket.emit('getServerConnectedUsers', { serverId: props.serverId! });
		}

		Socket.on('serverUserList', (data: { userList: string[] }) => {
			setHasConnectedUsers(true);
			setConnectedUsers(data.userList);
		})

		Socket.on('userJoined', (data: { pseudo: string, id: string }) => {
			console.log(`${data.pseudo} connects`);
			setConnectedUsers([data.id, ...connectedUsers]);
		})

		Socket.on('userLeft', (data: { pseudo: string, id: string }) => {
			console.log(`${data.pseudo} left`);
			setConnectedUsers(connectedUsers.filter(elt => elt !== data.id));
		})

		Socket.on('newMember', (data: { user: User }) => {
			console.log('new member');
			props.setServerUsers([data.user, ...props.serverUsers]);
			console.log('empty new ?', [data.user, ...props.serverUsers])
		})

		Socket.on('goneMember', (data: { user: User }) => {
			console.log('Gone member : ', data);
			console.log(props.serverUsers); 
			console.log(props.serverUsers.filter(elt => elt.id !== data.user.id));
			let oldList = JSON.parse(JSON.stringify(props.serverUsers));
			props.setServerUsers(oldList.filter((elt: User) => elt.id !== data.user.id));
			console.log('empty gone ?', [data.user, ...oldList])

		})



		return () => {
			Socket.off('serverUserList');
			Socket.off('userJoined');
			Socket.off('userLeft');
			Socket.off('newMember');
			Socket.off('goneMember');
		}

	}, [props.serverId, connectedUsers]
	);

	return (
		<div className="members">
			<h4 className="heading">Users :</h4>
			<Stack className="stack" spacing={0.8}>
				{props.serverUsers.map((user, index) => (
					<UserItem key={index} user={user} isConnected={connectedUsers.includes(user.id)} />
				))}
			</Stack>

			{props.serverUsers.length > 0 && (
				<button className="joinOrLeaveButton" onClick={props.joinServer} disabled={props.isDisabled}>
					{props.serverUsers.some(user => user.id === props.userId) ? 'leave' : 'join'}
				</button>
			)}
		</div>
	);
}