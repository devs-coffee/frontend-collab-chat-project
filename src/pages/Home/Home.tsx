import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import useIoSocket from "../../Hooks/useIoSocket";
import Header from "../../components/template/header/Header";
import { IoProvider } from "../../interfaces/IIoProvider";
import { ServerService } from "../../services/serverService";
import { setServers } from "../../redux/serversSlice";

import "./Home.scss";

export default function Home() {
  const serverService = new ServerService();
  const { ioClose } = useIoSocket() as IoProvider;
  const [isDataLoading, setDataLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const getServers = async () => {
    try {
        const response = await serverService.getServers();
        if(response.isSucceed) {
          dispatch(setServers(response.result));
          setDataLoading(false);
        }
        return null;
    } catch (error) {
      setDataLoading(false);
      return null;
    }
  }

  useEffect(() => {
    if(isDataLoading) {
      getServers();
    }

    return () => {
      ioClose();
    }
  }, [ioClose, isDataLoading]);

  return (
    <div className="Home">
      <Header/>
      <nav><Link to="/">Accueil</Link></nav>
      <Outlet />
    </div>
  );
}