<#import "instaff-layout.ftl" as instaff>

<@instaff.instaffPage>
  <h1 class="title">${msg("emailForgotTitle")}</h1>
  <p>${msg("emailInstruction")}</p>

  <form id="kc-reset-password-form" action="${url.loginAction}" method="post">
    <div class="field">
      <label for="username">${msg("usernameOrEmail")}</label>
      <input id="username" name="username" type="text" autofocus autocomplete="username" />
    </div>

    <button class="btn-primary" type="submit">
      ${msg("doSubmit")}
    </button>

    <div class="actions">
      <a href="${url.loginUrl}">${msg("backToLogin")}</a>
    </div>
  </form>
</@instaff.instaffPage>
