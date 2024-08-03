<style lang="sass">
  body,
  main,
  html
    margin: 0
    padding: 0
    background-color: #123
    color: white
    font-family: 'Arial', sans-serif
    display: flex
    justify-content: center
    align-items: center
    height: 100vh
    text-align: center
  .container
    max-width: 600px
    padding: 20px
  .hero
    h1
      font-size: 10em
      margin: 0
      text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5)
      letter-spacing: 10px
      animation: pulse 1.5s infinite
    p
      font-size: 2em
      margin: 10px 0 0
      text-transform: uppercase
      letter-spacing: 5px
  .description p
    font-size: 1.2em
    margin-top: 20px
    line-height: 1.5
    opacity: 0.8
  .buttons
    margin-top: 20px
  .home-button,
  .contact-button
    display: inline-block
    margin: 10px
    padding: 10px 20px
    font-size: 1em
    color: white
    background-color: #007BFF
    border: none
    border-radius: 5px
    text-decoration: none
    transition: background-color 0.3s ease, transform 0.3s ease
  .home-button:hover, .contact-button:hover
    background-color: #0056b3
    transform: scale(1.05)
  @keyframes pulse
    0%
      transform: scale(0.95)
    50%
      transform: scale(1)
    100%
      transform: scale(0.95)
  @media (max-width: 600px)
    .hero
      h1
        font-size: 5em
      p
        font-size: 1.5em
    .description p
      font-size: 1em
    .home-button,
    .contact-button
      font-size: 0.9em
      padding: 8px 16px
</style>
<div class="container">
  <div class="hero">
    <h1>404</h1>
    <p>Page Not Found</p>
  </div>
  <div class="description">
    <p>Oops! The page you are looking for does not exist. It might have been moved or deleted. Please check the URL or return to the homepage.</p>
    <p>If you think this is a mistake, you can contact our support team for assistance.</p>
    <div class="buttons">
      <a href="/" class="home-button">Go to Homepage</a>
      <a href="/contact" class="contact-button">Contact Support</a>
    </div>
  </div>
</div>
