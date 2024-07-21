import { useEffect, useState } from 'react';
import { User } from '../../sbook.jsx';

function SettingsOverview() {
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
      <div className="hero w3-container w3-round-large w3-margin">
        <img src={userProfile} />
        <h1>{userName}</h1>
      </div>
      <div>
        edithings
      </div>
    </>
  );
}

export default SettingsOverview;
