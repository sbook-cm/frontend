import { Outlet, Link } from "react-router-dom";
import Header from './Header.jsx'

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
};

export default Layout;
