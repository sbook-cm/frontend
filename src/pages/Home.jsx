import { useState } from 'react';
//import reactLogo from './assets/react.svg';
//import viteLogo from '/vite.svg';
import './home.sass';
import { Link } from 'react-router-dom';
import background from '../svg/back-dark.svg';
import $ from 'jquery';

function Home() {
  window.onscroll = function() {
      var sticky = $("header")[0].offsetTop;
      if (window.pageYOffset >= sticky) {
        $("header").addClass("sticky")
      } else {
        $("header").removeClass("sticky");
      }
  }
  return (
    <>
      <main>
          <section className="hero">
              <h1 className="w3-jumbo nova-oval">Where Learning Comes Alive</h1>
              <p>The ultimate platform for students and teachers to connect, learn, and grow.</p>
              <Link
                  to="/signup"
                  className="w3-hover-border-white w3-hover-deep-purple w3-border-deep-purple w3-border w3-large w3-right-align w3-button w3-rignt">
                  Get Started
                  <span></span>
              </Link>
          </section>
          <section className="intro">
              <h2>Problem</h2>
              <ul>
                  <li>
                    <strong>Education:</strong>
                    Reports that 1.9 million childern in Cameroon were in need of scholar assistance
                    due to immigration, or instability. In the world more children cannot access education.
                  </li>
                  <li>
                    <strong>Employment</strong>
                    In may 2022 the Cameroon government decided that graduates from
                    <abbr>ENS</abbr> and <abbr>ENSET</abbr> will no longer be employed into
                    public offices, how many unemployed teachers would we have?
                  </li>
              </ul>
              <h2 className="w3-center">Imagine joining these two problems into one solution...</h2>
          </section>
          <section className="w3-card-2 intro">
              <h2>Welcome to Sbook</h2>
              <p>Sbook is a comprehensive e-learning platform designed to make education more accessible and effective for students, teachers, and schools. Our tools and features are crafted to enhance learning experiences and provide valuable resources for educational growth.</p>
          </section>
          <header>
              <nav>
                  <a href="#" className="logo nova-oval">
                      {/*<img src="/image/sbook.png" width="40px" className="w3-left w3-xxlarge" style="margin: 5px;" />Sbook*/}
                  </a>
                  <ul>
                      <li><Link to="/signin" className="w3-button">Sign In</Link></li>
                      <li><Link to="/signup" className="w3-button">Sign Up</Link></li>
                  </ul>
              </nav>
          </header>
          <section className="cards">
              <div className="card" particles="index-card-note" id="note-card">
                  <h2>Note</h2>
                  <p>Get free access to notes, courses, tutorials, videos..., what you need.</p>
                  <p className="extended">A platform that uses natural language syntax like Markdown, making it easy for users to edit and share their notes.
                  Users can convert notes from formats such as PDF or Word and share them according to their preferences. This feature streamlines the process of note-taking and ensures that students have access to well-organized and easily shareable notes.</p>
              </div>
              <div className="card" particles="index-card-quizz" id="quizz-card">
                  <h2>Quizz</h2>
                  <p>Provides multiple choice and structural quizzes for users to generate tests.</p>
                  <p className="extended">Send to teachers for evaluation, or use the tools for grading. This feature helps students to practice and assess their knowledge, while teachers can create and manage quizzes effortlessly.</p>
              </div>
              <div className="card" particles="index-card-school" id="school-card">
                  <h2>School</h2>
                  <p>A virtual classNameroom environment for students and teachers to interact.</p>
                  <p className="extended">Share materials, conduct discussions, and manage assignments. This feature fosters a collaborative learning environment and ensures that all educational activities are centralized and easily accessible.</p>
              </div>
              <div className="card" particles="index-card-school" id="pango-card">
                  <h2>Pango</h2>
                  <p>The friendly helper bot, for your questions and .</p>
                  <p className="extended">Research, ask, explore and learn with a friendly bot.</p>
              </div>
          </section>
          <section className="features">
              <h2>Key Features</h2>
              <ul>
                  <li><strong>Interactive Learning:</strong> Engage students with interactive content and real-time feedback.</li>
                  <li><strong>Resource Sharing:</strong> Easily share notes, quizzes, and other educational materials.</li>
                  <li><strong>Collaboration Tools:</strong> Facilitate communication and collaboration between students and teachers.</li>
                  <li><strong>Accessibility:</strong> Ensure that educational resources are available to all students, regardless of their location or circumstances.</li>
                  <li><strong>Customizable:</strong> Tailor the platform to meet the specific needs of your educational institution.</li>
              </ul>
          </section>
          <section className="about">
              <h2>About Sbook</h2>
              <p>Sbook was created to address the challenges faced by students, teachers, and schools in accessing quality education. Our platform leverages technology to provide a seamless and efficient learning experience, ensuring that everyone has the opportunity to succeed.</p>
              <p>Whether you're a student looking for study materials, a teacher wanting to share your knowledge, or a school aiming to enhance your educational offerings, Sbook has the tools and features you need.</p>
          </section>
      </main>
      <footer>
          <p>&copy; 2024 ken-morel. All rights reserved.</p>
          <p>
              <Link to="#">About</Link> |
              <Link to="#">Contact</Link> |
              <Link to="/privacy-policy">Privacy Policy</Link> |
              <Link to="/terms-of-service">Terms of Service</Link>
          </p>
      </footer>
    </>
  );
}

export default Home;
