import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";

import useIoSocket from "../../Hooks/useIoSocket";
import Header from "../../components/template/header/Header";
import { IoProvider } from "../../interfaces/IIoProvider";

import "./Home.scss";

export default function Home() {
  const { ioClose } = useIoSocket() as IoProvider;
  useEffect(() => {
    return () => {
      ioClose();
    }
  }, [ioClose]);
  return (
    <div className="Home">
      <Header/>
      <nav><Link to="/">Accueil</Link></nav>
      <Outlet />
    </div>
  );
}
