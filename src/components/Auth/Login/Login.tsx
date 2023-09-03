import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { AxiosError } from "axios";

import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { setLogs } from "../../../redux/authSlice";
import { AuthenticationService } from "../../../services/authenticationService";
import { FormValidationService } from "../../../utils/formValidationService";
import { MessageError } from "../../";

import "../../../styles/tailwind.css";

const formValidationService = new FormValidationService();

export function Login(props: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string>("");

  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validate={formValidationService.validateLogin}
        onSubmit={async (values) => {
          setLoginError("");
          try {
            const response = await new AuthenticationService().login(values);
            dispatch(setLogs(response.result));
            navigate("/");
          } catch (error) {
            const errorMessage = error as Error;
            setLoginError(errorMessage.message);
          }
        }}
      >
        {(formik) => (
          <Form>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              Connexion au compte
            </h2>
            <div className="mt-10">
              <div>
                <label className="label" htmlFor="login-email">
                  Addresse e-mail
                </label>
                <Field
                  className="input"
                  type="text"
                  name="email"
                  id="login-email"
                />
              </div>
              <p className="form-error-message">
                <ErrorMessage name="email" />
              </p>
              <div className="mt-4">
                <label className="label" htmlFor="login-password">
                  Mot de passe
                </label>
                <Field
                  className="input"
                  type="password"
                  name="password"
                  id="login-password"
                  
                />
              </div>
              <p className="form-error-message">
                <ErrorMessage name="password" />
              </p>
              <div>
                <button className="button mt-4" type="submit">
                  Se connecter
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      
      {loginError && (
        <MessageError
          setCallbackClose={() => setLoginError("")}
          open={loginError !== ""}
          message={loginError}
        />
      )}
    </div>
  );
}
