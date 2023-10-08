import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";

import { unsetLogs } from "../../../redux/authSlice";
import { unsetServers } from "../../../redux/serversSlice";
import { useDarkMode } from "../../../hooks/useDarkMode";
import type { User } from "../../../interfaces/IUser";
import { Theme } from "../../../interfaces/Theme.enum";
import { DarkModeSwitch } from "../../";

import './Header.scss';

export function Header({ ioClose }: { ioClose?: () => void }): JSX.Element {

    const dispatch = useDispatch();
    const authStatus = useSelector((state: any) => state.authStatus);
    const user: User = authStatus.user;

    const [darkMode, setDarkMode] = useDarkMode();
    const [unreadMessages, setUnreadMessages] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isAccountMenuOpen = Boolean(anchorEl);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAvatarClose = () => {
        setAnchorEl(null);
    }


    const logout = () => {
        if (ioClose) {
            ioClose();
        }
        dispatch(unsetLogs());
        dispatch(unsetServers());
    }



    useEffect(() => {
        if (user && user.prefs?.colorScheme) {
            user.prefs?.colorScheme === Theme.dark ? setDarkMode(true) : setDarkMode(false);
        }
    }, [user, setDarkMode]);



    return (
        <div className="Header">
            <h1>
                <div className="logo-container">
                    <Link to="/"><img src={process.env.PUBLIC_URL + "/images/openChatRooms.png"} alt="logo openChatRooms" /></Link>
                </div>
                <div className="sitename">
                    <Link to="/">OpenChatRooms</Link>
                </div>
                <div className="logpad-container">
                    {authStatus.isLogged && (
                        <div className="logpad">
                            <IconButton
                                onClick={handleAvatarClick}
                                aria-controls={isAccountMenuOpen ? 'Votre compte' : undefined}
                                aria-haspopup="true"
                                aria-expanded={isAccountMenuOpen ? "true" : undefined}
                            >
                                {user.picture && <Avatar alt="votre avatar" src={user.picture} />}
                                {!user.picture && <Avatar>{user.pseudo.substring(0, 1).toUpperCase()}</Avatar>}
                                <span className="iconbutton-label">{user.pseudo}</span>
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
                                <MenuItem>
                                    <Link to="private_messages">Messages</Link>
                                </MenuItem>
                                <MenuItem>
                                    <DarkModeSwitch
                                        darkMode={darkMode}
                                        setDarkMode={setDarkMode}
                                    />
                                </MenuItem>
                                <MenuItem onClick={() => logout()}>
                                    <span className="logout-link">Déconnexion</span>
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </div>
            </h1>
        </div>
    )
}