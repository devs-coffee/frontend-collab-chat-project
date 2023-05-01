import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";

import { unsetLogs } from "../../../redux/authSlice";
import { unsetServers } from "../../../redux/serversSlice";

import './Header.scss';

export default function Header() {
    const dispatch = useDispatch();
    const authStatus = useSelector((state:any) => state.auth);
    
    const [anchorEl, setAnchorEl]  = useState<null | HTMLElement>(null);
    const isAccountMenuOpen = Boolean(anchorEl);
    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleAvatarClose = () => {
        setAnchorEl(null);
    }
    const logout = () => {
        dispatch(unsetLogs());
        dispatch(unsetServers());
    }

    return (
        <div className="Header">
            <h1>
                <div className="logo-container">
                    <img src="./images/openChatRooms.png" alt="logo openChatRooms" />
                </div>
                <div className="sitename">
                    OpenWebChat
                </div>
                <div className="logpad-container">
                    {authStatus.isLogged && (
                        <div className="logpad">
                            <IconButton
                                onClick={handleAvatarClick}
                                aria-controls={ isAccountMenuOpen ? 'Votre compte' : undefined}
                                aria-haspopup="true"
                                aria-expanded={ isAccountMenuOpen ? "true" : undefined}
                            >
                                {authStatus.user.picture && <Avatar alt="votre avatar" src={authStatus.user.picture} />}
                                {!authStatus.user.picture && <Avatar>{authStatus.user.pseudo.substring(0, 1).toUpperCase()}</Avatar>}
                                {authStatus.user.pseudo}
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={isAccountMenuOpen}
                                onClose={handleAvatarClose}
                                onClick={handleAvatarClose}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem>
                                    <Link to="profile">Profil</Link>
                                </MenuItem>
                                <MenuItem onClick={() => logout()}>
                                    <span className="logout-link" >Déconnexion</span>
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </div>
            </h1>
        </div>
    )
}