import { useEffect, useState } from 'react';
import { User } from '../../sbook.jsx';

function SettingsSessions() {
  let [userProfile, setUserProfile] = useState("");
  let [userName, setUserName] = useState("");
  useEffect(() => {
    User.get_current().then(function(user) {
      setUserProfile(user.profile);
      setUserName(user.name);
    });
  }, []);
  return (
    <>
      <div>
        <ul id="sessions-list">
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
          <li> session 1</li>
        </ul>
      </div>
    </>
  );
}

export default SettingsSessions;
