import { useState } from "react";
import { Login, Signup, Header } from "../../components";

export function Auth() {
  const [signup, setSignup] = useState(true);

  const toggleComponent = (): void => {
    setSignup(!signup);
  };

  return (
    <div>
      <Header />
      <div onClick={toggleComponent}>
        {signup ? "Nouveau ?\nS'enregistrer" : "Déjà inscrit?\nSe connecter"}
      </div>
      {signup ? <Login /> : <Signup />}
    </div>
  );
}
