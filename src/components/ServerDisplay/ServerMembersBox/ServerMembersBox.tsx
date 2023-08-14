import "./ServerMembersBox.scss";
import { Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { User } from "../../../interfaces/IUser";

interface ServerMemberBoxProps {
	serverUsers: User[];
	compareID: string; 
	joinServer: () => void;
	isDisabled: boolean;
}

export function ServerMembersBox(props: ServerMemberBoxProps): JSX.Element {

	return (
		<div className="members">
			<h4 className="heading">Users :</h4>
			<Stack className="stack" spacing={0.8}>
				{props.serverUsers.map(user => (
					<Link key={`link-${user.id}`} to={`/user/${user.id}`}>{user.pseudo}</Link>
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