import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import useIoSocket from "../../Hooks/useIoSocket";
import Header from "../../components/template/header/Header";
import { IoProvider } from "../../interfaces/IIoProvider";
import { fetchServers } from "../../redux/serversSlice";
import { AppDispatch } from "../../redux/store";

import "./Home.scss";

export default function Home() {
  const { ioClose, Socket } = useIoSocket() as IoProvider;
  
  const dispatch = useDispatch<AppDispatch>();
  const serversStatus = useSelector((state:any) => state.servers.status)

  useEffect(() => {
    if(serversStatus === "idle") {
      dispatch(fetchServers());
    }

    Socket.on("connect", () => {
      console.log(Socket.connected); // true
    });

    return () => {
      if(serversStatus !== "idle") {
        ioClose();
      }
    }
  }, []);

  return (
    <div className="Home">
      <Header/>
      <nav><Link to="/">Accueil</Link></nav>
      <Outlet />
    </div>
  );
}