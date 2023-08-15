import { Link } from "react-router-dom";

import { Badge } from "@mui/material";
import { User } from "../../interfaces/IUser";

import "./UserItem.scss";

type UserListItemProps = {
    user: User
    isConnected: boolean
}

export function UserItem(props: UserListItemProps) {
    return (
        <div className="UserItem">
            <Badge color="success" variant="dot" invisible={!props.isConnected} >
                <Link to={`/user/${props.user.id}`}>{props.user.pseudo}</Link>
            </Badge>
        </div>
        
    );
}