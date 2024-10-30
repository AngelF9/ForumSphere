import "./styles.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Firebase"; // Import the initialized auth instance
import { sendAuthenticatedRequest } from "../auth/sendAuthenticatedRequest"; // Import the function
import {
  signInWithPopup,
  GoogleAuthProvider,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";

export const AuthPage = ({
  setIsAuth,
}: {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="auth-container-two">
      <div className="auth">
        <div className="google-login">
          <GoogleLogin setIsAuth={setIsAuth} />
        </div>
      </div>
    </div>
  );
};

const GoogleLogin = ({
  setIsAuth,
}: {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  let navigate = useNavigate();
  const authInstance = auth;

  const handleGoogleLogin = () => {
    const newProvider = new GoogleAuthProvider();
    newProvider.setCustomParameters({ prompt: "select_account" });

    setPersistence(authInstance, browserSessionPersistence)
      .then(() => signInWithPopup(authInstance, newProvider))
      .then(async (result) => {
        console.log("result: ", result);

        const idToken = await result.user.getIdToken(true);
        console.log("Firebase ID token: ", idToken);

        if (idToken && result.user) {
          // Call the function to send the request
          await sendAuthenticatedRequest();

          localStorage.setItem("isAuth", "true");
          setIsAuth(true);
          navigate("/");
        }
      })
      .catch((error) => {
        console.log("Error during login:", error);
      });
  };

  return <button onClick={handleGoogleLogin}>Sign in with Google</button>;
};
