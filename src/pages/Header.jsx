import './header.sass';
import $ from 'jquery';
import { useState, useEffect } from 'react';
import { User } from '../sbook.jsx';

function Header() {
  let [isClose, close] = useState(true);
  let [userProfile, setUserProfile] = useState("");
  useEffect(() => {
    User.get_current().then(function(user) {
      setUserProfile(user.profile);
    });
  }, []);
  return (
    <>
      <header>
        <div id="menu-like-icon" className={isClose?"button close":"botton"} onClick={(e)=>close(!isClose)}>
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>

        <button class="profile b f2">
          <img src={userProfile} height="40" className="w3-circle" />
        </button>
      </header>
    </>
  );
}

export default Header;
