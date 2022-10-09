import { Outlet, Link } from "react-router-dom";

import Header from "../../components/template/header/Header";

import "./Home.scss";

export default function Home() {
  return (
    <div className="Home">
      <Header/>
      <nav><Link to="/">Accueil</Link></nav>
      <Outlet />
    </div>
  );
}
