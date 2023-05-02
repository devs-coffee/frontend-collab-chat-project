import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import useIoSocket from "../../Hooks/useIoSocket";
import Header from "../../components/template/header/Header";
import { IoProvider } from "../../interfaces/IIoProvider";
import { fetchServers } from "../../redux/serversSlice";
import { AppDispatch } from "../../redux/store";

import "./Home.scss";

export default function Home() {
  const { ioClose } = useIoSocket() as IoProvider;
  
  const dispatch = useDispatch<AppDispatch>();
  const serversStatus = useSelector((state:any) => state.servers.status)

  useEffect(() => {
    if(serversStatus === "idle") {
      dispatch(fetchServers());
    }

    return () => {
      if(serversStatus !== "idle") {
        ioClose();
      }
    }
  }, [ioClose, serversStatus, dispatch]);

  return (
    <div className="Home">
      <Header/>
      <Outlet />
    </div>
  );
}