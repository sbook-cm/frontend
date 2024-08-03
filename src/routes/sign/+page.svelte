<style lang="sass">
  form
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
</style>
<script lang="ts">
  import '../base.sass';
  let
    email: String = "",
    is_email: Boolean = true,
    number: String = "",
    password: String = "";
</script>
<form action="+page_submit" method="get" accept-charset="utf-8">
  <label for="is_email" class="checkbox-slider round">
    <input type="checkbox" id="is_email" name="is_email" bind:checked={is_email} />
    <span></span>
  </label>
  <div class="form-entry" id="email-number-name-container">
    <label class="form-entry-field" shown={is_email}>
      Your email:
      <input type="email" name="email" bind:value={email}>
    </label>
    <label class="form-entry-field" shown={!is_email}>
      Your number:
      <input type="tel" name="number" bind:value={number}>
    </label>
  </div>
  <div class="form-entry" id="pasword-container">
    <label class="form-entry-field" shown="true">
      Your password:
      <input type="password" name="password" bind:value={password}>
    </label>
  </div>
</form>
