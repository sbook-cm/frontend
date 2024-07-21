import { Outlet, Link } from "react-router-dom";
import Header from '../Header.jsx'
import SettingsTocTree from './TocTree.jsx';
import './settings.sass';
import '../../styles.sass';


const Layout = () => {
  return (
    <>
      <Header />
      <SettingsTocTree />
      <div id="settings-view">
        <Outlet />
      </div>
    </>
  )
};

export default Layout;
