import { Link } from "react-router-dom";

import { Badge } from "@mui/material";
import { User } from "../../interfaces/IUser";

type UserListItemProps = {
    user: User
    isConnected: boolean
}

export function UserListItem(props: UserListItemProps) {
    return (
        <Badge color="success" variant="dot" invisible={!props.isConnected} >
            <Link to={`/user/${props.user.id}`}>{props.user.pseudo}</Link>
        </Badge>
    );
}