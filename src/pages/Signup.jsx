import { useState } from 'react';
import './sign.sass';

function Signup() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  return (
    <form id="signup" className="">
      <label htmlFor="email">
        Your email:
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label htmlFor="password">
        Your email:
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
    </form>
  );
}

export default Signup;