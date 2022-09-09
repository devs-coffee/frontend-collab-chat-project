import { Link } from "react-router-dom";
import "./Home.scss";

export default function Home() {
  return (
    <div className="Home">
      <h1>Hello world !</h1>
      <Link to="/auth">Login</Link>
      
    </div>
  );
}
