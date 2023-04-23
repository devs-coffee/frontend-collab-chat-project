import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Avatar } from "@mui/material";

import { User } from "../../interfaces/IUser";
import { UserService } from "../../services/userService";

import './UserDisplay.scss';

const userService = new UserService();

export default function UserDisplay() {
    const [displayedUser, setDisplayedUser] = useState<User | null>(null);
    const urlSearchParams = useParams();

    const getUser = async () => {
        try {
            const response = await userService.getUser(urlSearchParams.userId!);
            if(response.isSucceed) {
                setDisplayedUser(response.result);
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
        getUser();
    }, [])
    
    return (
        <div className="UserDisplay">
            <div className="heading">
                {displayedUser?.picture ? 
                    (<Avatar alt="avatar membre" src={displayedUser.picture} />)
                    :
                    (<Avatar alt="avatar membre">{displayedUser?.pseudo.substring(0, 1).toUpperCase()}</Avatar>)
                }
                <h3>{displayedUser?.pseudo}</h3>
            </div>
            <p className="temp-content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet iure quo aspernatur illum atque libero quam rem quia quaerat exercitationem minima cupiditate eum, necessitatibus blanditiis ut soluta facilis est dolore?</p>
        </div>
    )
}