<main class="home">
    <section class="hero" id="hero">
          <h1 class="w3-jumbo nova-oval">Where Learning Comes Alive</h1>
        <p>The ultimate platform for students and teachers to connect, learn, and grow.</p>
        <a
            href="/signin"
            class="w3-hover-border-deep-purple w3-deep-purple w3-border-white w3-border w3-large w3-right-align w3-button"
        >
            Sign in
            <span></span>
        </a>
        <a
            href="/signup"
            class="w3-hover-border-white w3-hover-deep-purple w3-border-deep-purple w3-border w3-large w3-right-align w3-button"
           >
              Get Started
            <span></span>
        </a>
    </section>
    <section class="intro">
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
        <h2 class="w3-center">Imagine joining these two problems into one solution...</h2>
    </section>
    <section class="w3-card-2 intro">
        <h2>Welcome to Sbook</h2>
        <p>Sbook is a comprehensive e-learning platform designed to make education more accessible and effective for students, teachers, and schools. Our tools and features are crafted to enhance learning experiences and provide valuable resources for educational growth.</p>
    </section>
    <header class="home">
        <nav>
            <a href="#hero" class="logo nova-oval">
                <!-- <img src="/image/sbook.png" width="40px" class="w3-left w3-xxlarge" style="margin: 5px;" />Sbook -->
            </a>
            <ul>
                <li><a href="/signin" class="w3-button">Sign In</a></li>
                <li><a href="/signup" class="w3-button">Sign Up</a></li>
            </ul>
        </nav>
    </header>
    <section class="cards">
        <div class="card" particles="index-card-note" id="note-card">
            <h2>Note</h2>
            <p>Get free access to notes, courses, tutorials, videos..., what you need.</p>
            <p class="extended">A platform that uses natural language syntax like Markdown, making it easy for users to edit and share their notes.
            Users can convert notes from formats such as PDF or Word and share them according to their preferences. This feature streamlines the process of note-taking and ensures that students have access to well-organized and easily shareable notes.</p>
        </div>
        <div class="card" particles="index-card-quizz" id="quizz-card">
            <h2>Quizz</h2>
            <p>Provides multiple choice and structural quizzes for users to generate tests.</p>
            <p class="extended">Send to teachers for evaluation, or use the tools for grading. This feature helps students to practice and assess their knowledge, while teachers can create and manage quizzes effortlessly.</p>
        </div>
        <div class="card" particles="index-card-school" id="school-card">
            <h2>School</h2>
            <p>A virtual classroom environment for students and teachers to interact.</p>
            <p class="extended">Share materials, conduct discussions, and manage assignments. This feature fosters a collaborative learning environment and ensures that all educational activities are centralized and easily accessible.</p>
        </div>
        <div class="card" particles="index-card-school" id="pango-card">
            <h2>Pango</h2>
            <p>The friendly helper bot, for your questions and .</p>
            <p class="extended">Research, ask, explore and learn with a friendly bot.</p>
        </div>
    </section>
    <section class="features">
        <h2>Key Features</h2>
        <ul>
            <li><strong>Interactive Learning:</strong> Engage students with interactive content and real-time feedback.</li>
            <li><strong>Resource Sharing:</strong> Easily share notes, quizzes, and other educational materials.</li>
            <li><strong>Collaboration Tools:</strong> Facilitate communication and collaboration between students and teachers.</li>
            <li><strong>Accessibility:</strong> Ensure that educational resources are available to all students, regardless of their location or circumstances.</li>
            <li><strong>Customizable:</strong> Tailor the platform to meet the specific needs of your educational institution.</li>
        </ul>
    </section>
    <section class="about">
        <h2>About Sbook</h2>
        <p>Sbook was created to address the challenges faced by students, teachers, and schools in accessing quality education. Our platform leverages technology to provide a seamless and efficient learning experience, ensuring that everyone has the opportunity to succeed.</p>
        <p>Whether you're a student looking for study materials, a teacher wanting to share your knowledge, or a school aiming to enhance your educational offerings, Sbook has the tools and features you need.</p>
    </section>
</main>
<footer>
    <p>&copy; 2024 ken-morel. All rights reserved.</p>
    <p>
        <a href="#about">About</a> |
        <a href="#contact">Contact</a> |
        <a href="/privacy-policy">Privacy Policy</a> |
        <a href="/terms-of-service">Terms of Service</a>
    </p>
</footer>
<script>
  import './home.sass';
  import { onMount } from 'svelte';
  onMount(() => {
    const handleScroll = () => {
      var sticky = document.querySelector("header").offsetTop;
      if (window.pageYOffset >= sticky) {
        document.querySelector("header").classList.add("sticky");
      } else {
        document.querySelector("header").classList.remove("sticky");
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>
