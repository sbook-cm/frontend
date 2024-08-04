<style lang="sass">
  form
    background-color: var(--base1)
    max-width: 500px
    margin: auto
    margin-top: 100px
    padding: 20px
    label.checkbox-slider
      display: block
    div.form-entry
      width: 100%
      display: block
      overflow: hidden
      position: relative
      padding: 5px
      label.form-entry-field
        display: none
        width: 100%
        position: relative
        left: 100%
        top: 0
        transition: 0.4s
        &[shown=true]
          width: 100%
          left: 0
          display: inline-block
        input
          background-color: var(--base2)
  .already-login-panel
    font-family: 'Open Sans', Arial
    span
      background-color: #777a
      border-radius: 3px
      padding: 2px
      font-family: var(--username-font), Arial
</style>
<script lang="ts">
  import '../base.sass';
  import { Session, User } from '$lib/db.js';
  export let data;
  let
    email: String = "",
    is_email: Boolean = true,
    number: String = "",
    password: String = "",
    session: Session;
  if(data.session) {
    session = new Session(data.session, new User(data.user));
  }
</script>
{#if session}
  <div class="w3-panel w3-padding w3-large already-login-panel w3-red">
    You are already login as <span>{session.user.name}</span>
  </div>
{/if}
<div>

</div>
<form method="POST">
  <div class="form-entry" id="email-number-name-container">
    <label for="is_email" class="checkbox-slider round horizontal">
      <input type="checkbox" id="is_email" name="is_email" bind:checked={is_email} />
      <span></span>
    </label>
    <label class="form-entry-field" shown={is_email}>
      Your email:
      <input class="w3-input" type="email" name="email" bind:value={email}>
    </label>
    <label class="form-entry-field" shown={!is_email}>
      Your number:
      <input class="w3-input" type="tel" name="number" bind:value={number}>
    </label>
  </div>
  <div class="form-entry" id="pasword-container">
    <label class="form-entry-field" shown="true">
      Your password:
      <input class="w3-input" type="password" name="password" bind:value={password}>
    </label>
  </div>
</form>
