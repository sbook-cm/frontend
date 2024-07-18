import './header.sass';
import $ from 'jquery';
import { useState, useEffect } from 'react';
import { Theme, User, ThemeSwitch } from '../sbook.jsx';
import { Link } from 'react-router-dom';

let rbar = {
  open: () => true,
  isopen: false,
};


function RightBar() {
  let [userProfile, setUserProfile] = useState("");
  let [user, setUser] = useState({});
  let [rightBarOpen, openRightBar] = useState(false);
  rbar.isopen = rightBarOpen;
  rbar.open = openRightBar;
  useEffect(() => {
    User.get_current().then(function(_user) {
      setUser(_user);
    });
  }, []);
  return (
    <div id="rightbar" className={!rightBarOpen?" closed":""}>
      <div className="profile button">
        <Link to="/settings/profile">
          <div>
            <img src={user.profile} height="50" />
          </div>
          <div>
            <h3>{user.name}</h3>
          </div>
        </Link>
      </div>
    </div>
  );
}

function Header() {
  let [isClosed, close] = useState(false);
  let [touched, beingTouched] = useState(false);
  let [userProfile, setUserProfile] = useState("");
  useEffect(() => {
    User.get_current().then(function(user) {
      setUserProfile(user.profile);
    });
  }, []);
  let curr = window.location.pathname;
  let links = [
    ["/", "Dashboard"],
    ["/note", "Note"],
  ];
  function isCurrentPath(path) {
    return window.location.pathname == path;
  }
  window.onscroll = function() {
    if(window.pageYOffset > 10 && !touched) {
      close(true);
    } else if(isClosed) {
      close(false);
      beingTouched(false);
    }
  }
  return (
    <>
      <header className={isClosed?"closed":""}>
        <div>
          <div id="menu-like-icon" className={!isClosed?"button close":"button"} onClick={(e)=>{close(!isClosed);beingTouched(true);if(rbar.isopen&&!isClosed)rbar.open(false);}}>
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
        </div>
        <span className="links">
          {links.map(([url, text]) => (
            <Link to={url} key={url} className={"w3-bar-item"+(isCurrentPath(url)?" selected":"")}>{text}</Link>
          ))}
        </span>
        <button className="profile b fa1" onClick={() => rbar.open(!rbar.isOpen)}>
          <img src={userProfile} height="40" className="w3-circle" />
        </button>
        <span class="themeSwitchContainer">
          <ThemeSwitch className="" />
        </span>
      </header>
      <RightBar />
    </>
  );
}

export default Header;
