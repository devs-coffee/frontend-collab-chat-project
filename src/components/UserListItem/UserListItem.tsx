import { Badge } from "@mui/material";
import { Link } from "react-router-dom";

type UserListItemProps = {
    userId: string,
    userPseudo: string,
    isConnected: boolean
}

export function UserListItem(props: UserListItemProps) {
    console.log(props.isConnected);
    return (
        <Badge color="success" variant="dot" invisible={!props.isConnected} >
            <Link to={`/user/${props.userId}`}>{props.userPseudo}</Link>
        </Badge>
    );
}