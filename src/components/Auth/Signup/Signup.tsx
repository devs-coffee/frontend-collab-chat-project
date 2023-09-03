import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { AxiosError } from "axios";

import { Avatar, Breadcrumbs, Button } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";

import { setLogs } from "../../../redux/authSlice";
import { signupForm } from "../../../interfaces/ISignupForm";
import { AuthenticationService } from "../../../services/authenticationService";
import { FormValidationService } from "../../../utils/formValidationService";
import { Modal, AvatarCropper, MessageError } from "../../";

import "../../../styles/tailwind.css";

const formValidationService = new FormValidationService();

export function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const updateImage = (image: string) => {
    setCroppedImage(image);
    setIsOpen(false);
    return image;
  };

  const handlePassowrdHelp = (value: string): JSX.Element => {
    let number = value.match(/[0-9]/);
    let lower = value.match(/[a-z]/);
    let upper = value.match(/[A-Z]/);
    let special = value.match(/[+\-/=!@_&*]/);
    let size = value.length >= 8;
    return (
      <div style={{ whiteSpace: "pre" }}>
        <p>
          Votre mot de passe doit contenir :<br />
          <span style={size ? { color: "green" } : { color: "red" }}>
            - au moins 8 caractères
          </span>
          <br />
          <span style={number ? { color: "green" } : { color: "red" }}>
            - un chiffre
          </span>
          <br />
          <span style={lower ? { color: "green" } : { color: "red" }}>
            - une minuscule
          </span>
          <br />
          <span style={upper ? { color: "green" } : { color: "red" }}>
            - une majuscule
          </span>
          <br />
          <span style={special ? { color: "green" } : { color: "red" }}>
            - un caractère spécial parmi + - * / = ! @ _ &
          </span>
        </p>
      </div>
    );
  };

  return (
    <div>
      <Formik
        initialValues={{
          pseudo: "",
          email: "",
          password: "",
          passwordConfirm: "",
          picture: "",
        }}
        validate={formValidationService.validateSignup}
        onSubmit={async (values: signupForm) => {
          values.picture = croppedImage;
          setSignupError("");
          try {
            const response = await new AuthenticationService().signup(values);
            dispatch(setLogs(response.result));
            navigate("/");
          } catch (error) {
            const errorMessage = error as Error;
            setSignupError(errorMessage.message);
          }
        }}
      >
        {(formik) => (
          <>
            <Form>
              <h2>inscription</h2>
              <div>
                <div>
                  <label htmlFor="signup_pseudo">Pseudo :</label>
                  <Field type="text" name="pseudo" id="signup_pseudo" />
                </div>
                <ErrorMessage name="pseudo" />
                <div>
                  <label htmlFor="signup-email">Email :</label>
                  <Field type="text" name="email" id="signup_email" />
                </div>
                <ErrorMessage name="email" />
                <div>
                  <label htmlFor="signup-password">Mot de passe :</label>
                  <Field type="text" name="password" id="signup_password" />
                </div>
                <ErrorMessage name="password" />
                <div>
                  <label htmlFor="signup-passwordconfirm">Confirmez :</label>
                  <Field
                    type="text"
                    name="passwordConfirm"
                    id="signup_passwordconfirm"
                  />
                </div>
                <ErrorMessage name="passwordConfirm" />
                <div>
                  <h3>Avatar :</h3>
                  {croppedImage === "" ? (
                    <Button
                      variant="contained"
                      startIcon={<AddPhotoAlternateIcon />}
                      onClick={() => setIsOpen(true)}
                    >
                      Ajouter
                    </Button>
                  ) : (
                    <>
                      <Avatar alt="avatar serveur demandé" src={croppedImage} />
                      <Breadcrumbs>
                        <EditIcon
                          sx={{ color: "#1616c4" }}
                          onClick={() => setIsOpen(true)}
                        />
                        <HighlightOffTwoToneIcon
                          sx={{ color: "#800101" }}
                          onClick={() => setCroppedImage("")}
                        />
                      </Breadcrumbs>
                    </>
                  )}
                </div>
                {isOpen && (
                  <Modal
                    setIsOpen={setIsOpen}
                    childComponent={<AvatarCropper setImage={updateImage} />}
                  />
                )}
                <Button
                  variant="contained"
                  type="submit"
                  endIcon={<SendIcon />}
                >
                  Envoyer
                </Button>
                <div
                  className={
                    formik.getFieldMeta("password").error
                      ? "invalidPassword"
                      : "validPassword"
                  }
                >
                  {handlePassowrdHelp(formik.getFieldProps("password").value)}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>

      <MessageError
        message={signupError}
        open={signupError !== ""}
        setCallbackClose={() => setSignupError("")}
      />
    </div>
  );
}
