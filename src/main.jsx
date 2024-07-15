import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import Layout from './pages/Layout.jsx';
import Signin from './pages/Signin.jsx';
import Signup from './pages/Signup.jsx';
import { User } from './sbook.jsx';
// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//analytics.logEvent('view');
// eslint-disable-next-line react-refresh/only-export-components
function App() {
  console.log("hello again");
  // const firebaseConfig = {
  //   apiKey: "AIzaSyA7XSXEGsjZjR3XnMbZMkq7ftQuLgGAvK0",
  //   authDomain: "sbook-429322.firebaseapp.com",
  //   projectId: "sbook-429322",
  //   storageBucket: "sbook-429322.appspot.com",
  //   messagingSenderId: "595307435004",
  //   appId: "1:595307435004:web:ef59023eef79651a1e5879",
  //   measurementId: "G-0PQLSEP1VF"
  // };
  // Initialize Firebase
  //const app=initializeApp(  firebaseConfig  );
  //const analytics = getAnalytics(app);
  // analytics.logEvent('button_click', {
  //   button_name: 'my_button',
  // });
  // useEffect(() => {
  //   const currentLocation = window.location.pathname;
  //   analytics.setCurrentScreen(currentLocation);
  // }, [analytics, useLocation()]);  
  User.get_current().then(function(user) {
    console.log("user login as:", user);
    ReactDOM.createRoot(document.querySelector("#root")).render(
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/" element={<Layout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </React.StrictMode>,
    );
  }).catch(function() {
    console.log("no user login");
    ReactDOM.createRoot(document.querySelector("#root")).render(
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>,
    );
  });
}
App();