import React, { useState } from "react";
import "../App.css";
import { SidebarData } from "./SidebarData";
import { getAuth, signOut } from "firebase/auth";
import LoginIcon from "@mui/icons-material/Login";

// interface
interface SideBarProps {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SideBar: React.FC<SideBarProps> = ({ isAuth, setIsAuth }) => {
  const [activeLink, setActiveLink] = useState<string>(
    window.location.pathname,
  );

  const handleClick = (link: string) => {
    setActiveLink(link);
    // Using history API to avoid full page reload
    window.location.pathname = link;
  };

  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        {SidebarData.map((val, index) => (
          <li
            className="row"
            id={activeLink === val.link ? "active" : ""}
            key={index}
            onClick={() => handleClick(val.link)}
          >
            <div id="icon">{val.icon}</div>
            <div id="title">{val.title}</div>
          </li>
        ))}

        {isAuth ? (
          <li className="row" onClick={() => setIsAuth(false)}>
            <div id="icon">🔓</div>
            <div id="title">
              <Logout setIsAuth={setIsAuth} /> {/* Render Logout button */}
            </div>
          </li>
        ) : (
          <li className="row" onClick={() => handleClick("/auth")}>
            <div id="icon">
              <LoginIcon />
            </div>
            <div id="title">Register</div>
          </li>
        )}
      </ul>
    </div>
  );
};

const Logout = ({
  setIsAuth,
}: {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("isAuth");
        setIsAuth(false);
        console.log("User logged out");
      })
      .catch((error) => {
        console.log("An error occured", error);
      });
  };
  return <button onClick={handleLogout}>Logout of Google</button>;
};
