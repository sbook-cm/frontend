<style lang="sass">
  abbr
    background-color: #7773
    font-weight: bold
    border-radius: 3px
    padding: 2px
  footer
    background-color: #123
    color: white
    text-align: center
    padding: 10px 20px

  footer a
      color: white
      text-decoration: none
      margin: 0 10px

  .nova-oval
    font-family: "Nova Oval", system-ui
    font-weight: 400
    font-style: normal

  main.home
    margin: 0
    font-family: Arial, sans-serif
    color: #E0E0E0
    background-image: linear-gradient(to top right, #0757 0%, #0000 20%, #0000 49%, #1237 50%, #0000 51%, #0000 80%, #5057 100%), url('/image/back-gmail.png')
    background-attachment: fixed
    background-size: 100%
  html
    background-color: #04080C

  header.home
      height: 50px
      background-color: #1E1E1E
      z-index: 20
      transition: 10s

  header.sticky
      position: sticky
      top: 0
      background-color: #1E1E1E55
      backdrop-filter: blur(5px)
      transition: 0.4s

  header.sticky:hover
    backdrop-filter: blur(1px)

  header.sticky + *
      padding-top: 25px


  nav
      display: flex
      justify-content: space-between
      align-items: center


  nav .logo
      font-size: 1.5em
      color: #BB86FC
      text-decoration: none


  nav ul
      list-style: none
      margin: 0
      padding: 10px 20px
      display: flex
      gap: 15px


  nav ul li
      margin: 0


  nav ul li a
    color: #E0E0E0
    text-decoration: none
    padding: 5px 10px
    border-radius: 5px
    transition: background-color 0.3s


  nav ul li a:hover
    background-color: #BB86FC
    color: #121212


  .hero
    text-align: center
    padding: 100px 20px
    background-color: #1124
    backdrop-filter: blur(2px)


  .hero h1
      font-size: 4em
      color: #BB86FC


  .hero a
    position: relative
    text-align: right
    -webkit-transition-duration: 0.4s /* Safari */
    transition-duration: 0.4s


  .hero a span
    background: #90EE90
    display: inline-block
    position: absolute
    top: 0
    right: 0
    width: 0
    height: 100%
    transition: all 0.4
    padding: 0
    margin: 0
    z-index: -1


  .hero a:hover span
    padding: 0
    margin: 0
    transition: 0.4s
    width: 100%


  .intro, .features, .about
      padding: 20px
      background-color: #1E1E1E55
      backdrop-filter: blur(5px)
      border: 3px #333a solid
      margin: 20px 0
      transition: 0.4s

  .intro:hover, .features:hover, .about:hover
    border: 3px #3333 solid


  .intro h2, .features h2, .about h2
      color: #BB86FC


  .cards
      display: flex
      flex-wrap: wrap
      gap: 20px
      justify-content: center
      padding: 20px


  .card
      background-color: #2C2C2C
      border-radius: 10px
      padding: 20px
      width: 400px
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7)
      transition: transform 0.3s


  .card:hover
    transform: translateY(-10px)
    box-shadow: 0 10px 15px rgba(0, 0, 0, 1)


  .card h2
    color: #BB86FC
    margin-top: 0
    font-size: xxx-large
    font-family: "Nova Oval", system-ui
    font-weight: 400
    font-style: normal


  #note-card

    background-color: #6643


  #note-card:hover

    border: 5px #6643 solid

  #pango-card

    background-color: #aaa3

  #pango-card:hover

    border: 5px #aaa3 solid

  #quizz-card

    background-color: #4663

  #quizz-card:hover

    border: 5px #4663 solid

  #school-card

    background-color: #6663

  #school-card:hover

    border: 5px #6663 solid

  #school-card, #quizz-card, #note-card, #pango-card

    transition: 0.4s
    border: 5px #0000 solid
    backdrop-filter: blur(2px)

  #school-card:hover, #quizz-card:hover, #note-card:hover, #pango-card:hover

    background-color: #0000
    backdrop-filter: blur(0px)


  .card p
      margin-bottom: 10px
      font-size: x-large
      color: white


  .card .extended
      color: darkgray
      font-size: small
      display: inline


  .features ul
      list-style: none
      padding: 0


  .features ul li
      margin: 10px 0


  .features ul li strong
      color: #BB86FC


</style>
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
                <img src="/image/sbook.png" width="40px" class="w3-left w3-xxlarge" style="margin: 5px;" />Sbook
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
