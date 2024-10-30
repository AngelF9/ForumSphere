import HomeIcon from "@mui/icons-material/HomeRounded";
import BookmarkIcon from "@mui/icons-material/BookmarkRounded";
import SettingsIcon from "@mui/icons-material/SettingsSuggestRounded";
import MgsIcon from "@mui/icons-material/MapsUgcRounded";
import LoginIcon from "@mui/icons-material/Login";

export const SidebarData = [
  {
    title: "Home",
    icon: <HomeIcon />,
    link: "/",
  },

  {
    title: "BookMarks",
    icon: <BookmarkIcon />,
    link: "/BookMarks",
  },

  {
    title: "Settings",
    icon: <SettingsIcon />,
    link: "/Profile",
  },

  {
    title: "Post",
    icon: <MgsIcon />,
    link: "/AddPost",
  },

  // {
  //   title: "Register",
  //   icon: <LoginIcon />,
  //   link: "/auth",
  // },
];
