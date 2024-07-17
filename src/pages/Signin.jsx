import { useState } from 'react';
import './sign.sass';
import { User } from '../sbook.jsx';
import $ from 'jquery';

function Signin() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState("");
  let [ousername, setOusername] = useState("");
  try {
    User.get_current().then((u) => setOusername(u.username)).catch((e) => {});
  } catch {}
  function submit(e) {
    e.preventDefault();
    User.signin(email, password)
      .then(function() {
        location.assign("/");
      })
      .catch(function(err) {
        let bg = $("form").css("background-color");
        if("msg" in err) setError(err.msg);
        $("form").css("background-color", "#5115");
        setTimeout(
          () => $("form").css("background-color", bg),
          5000,
        );
      });
  }


  return (
    <>
      {ousername && (
        <p className="w3-panel w3-red w3-opacity">
          you are already login as {ousername}
        </p>
      )}
      <form id="signin" className="w3-container w3-round" onSubmit={submit}>
        {error && (
          <p className="w3-round w3-red w3-opacity">
            {error}
          </p>
        )}
        <label htmlFor="email">
          Your email:
          <input
            className="w3-input"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password">
          Your password:
          <input
            className="w3-input"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input type="submit" className="w3-button w3-border w3-border-deep-purple w3-round w3-center" />
      </form>
    </>
  );
}

export default Signin;
