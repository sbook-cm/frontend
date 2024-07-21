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
    <div id="rightbar" className={!rbar.isopen?"colorful-0 closed":"colorful-0"}>
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
      <hr />
      <h4  className="settings-header button">
        <Link to="/settings">settings</Link>
      </h4>
      <div  className="settings-links">
        <Link className="button" to="/settings/profile">profile</Link>
        <Link className="button" to="/settings/connections">connections</Link>
        <Link className="button" to="/settings/sessions">sessions</Link>
        <hr />
        <Link className="button" to="/logout">logout</Link>
      </div>
      <hr />
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
    ["/settings", "Settings"],
  ];
  function isCurrentPath(path) {
    if(path != "/") return window.location.pathname.startsWith(path);
    return path == window.location.pathname;
  }
  window.onscroll = function() {
    setTimeout(function() {
      if(window.pageYOffset > 10 && !touched) {
        close(true);
      } else if(isClosed) {
        close(false);
        beingTouched(false);
      }
    }, 400);
  }
  return (
    <>
      <header className={isClosed?"closed navheader colorful-15":"navheader colorful-15"}>
        <div>
          <div id="menu-like-icon" className={!isClosed?"button close":"button"} onClick={(e)=>{close(!isClosed);beingTouched(true);if(rbar.isopen&&!isClosed)rbar.open(false);}}>
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
        </div>
        <span className="links">
          {links.map(([url, text]) => (
            <a href={url} key={url} className={"w3-bar-item"+(isCurrentPath(url)?" selected":"")}>{text}</a>
          ))}
        </span>
        <button className="profile b fa1" onClick={() => rbar.open(!rbar.isOpen)}>
          <img src={userProfile} height="40" className="w3-circle" />
        </button>
        <span className="themeSwitchContainer">
          <ThemeSwitch className="" />
        </span>
      </header>
      <RightBar />
    </>
  );
}

export default Header;
