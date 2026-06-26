import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const RootLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export default RootLayout;
