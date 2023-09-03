import { useState } from "react";
import { Login, Signup, Header } from "../../components";

export function Auth() {
  const [signup, setSignup] = useState(true);

  const toggleComponent = (): void => {
    setSignup(!signup);
  };

  return (
    <div className="min-h-screen h-full bg-gray-900 flex items-center">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-24 w-auto"
            src="/images/openChatRooms.png"
            alt="openChatRooms logo"
          />
          {signup ? <Login /> : <Signup />}
          <div onClick={toggleComponent}>
            {signup ? (
              <>
                <p className="mt-10 text-center text-sm text-gray-400">
                  Pas encore inscrit ?{" "}
                  <span
                    className="font-semibold leading-6 text-roman-coffee-400 hover:text-roman-coffee-300 hover:underline cursor-pointer"
                    onClick={toggleComponent}
                  >
                    Créer un compte
                  </span>
                </p>
              </>
            ) : (
              <>
                <p className="mt-10 text-center text-sm text-gray-400">
                  Déjà inscrit ?{" "}
                  <span
                    className="font-semibold leading-6 text-roman-coffee-400 hover:text-roman-coffee-300 hover:underline cursor-pointer"
                    onClick={toggleComponent}
                  >
                    Se connecter
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
