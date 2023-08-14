import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import useIoSocket from "../../hooks/useIoSocket";
import { Header } from "../../components";
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
  }, [dispatch, ioClose]);

  return (
    <div className="Home">
      <Header ioClose={ioClose}/>
      <Outlet />
    </div>
  );
}