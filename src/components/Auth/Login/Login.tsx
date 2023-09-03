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
            <h2>Connexion</h2>
            <div>
              <div>
                <label htmlFor="login-email">E-mail :</label>
                <Field type="text" name="email" id="login-email" />
              </div>
              <ErrorMessage name="email" />
              <div>
                <label htmlFor="login-password">Mot de passe :</label>
                <Field type="text" name="password" id="login-password" />
              </div>
              <ErrorMessage name="password" />
              <div>
                <Button
                  variant="contained"
                  type="submit"
                  endIcon={<SendIcon />}
                >
                  Envoyer
                </Button>
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
