import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import useIoSocket from "../../hooks/useIoSocket";
import { Header } from "../../components";
import { IoProvider } from "../../interfaces/IIoProvider";

import "./Home.scss";

export function Home() {
  const { ioClose, Socket } = useIoSocket() as IoProvider;

  useEffect(() => {

    Socket.on("connect", () => {
      console.log('Socket connected : ', Socket.connected); // true
    });

    return () => {
      ioClose();
    }
  }, [ioClose]);

  return (
    <div className="Home">
      <Header ioClose={ioClose} />
      <Outlet />
    </div>
  );
}