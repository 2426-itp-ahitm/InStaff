<#import "instaff-layout.ftl" as instaff>

<@instaff.instaffPage>
  <h1 class="title">${msg("loginTitle")}</h1>

  <form id="kc-form-login" action="${url.loginAction}" method="post">
    <div class="field">
      <label for="username">${msg("username")}</label>
      <input id="username" name="username" type="text" autofocus autocomplete="username" />
    </div>

    <div class="field">
      <label for="password">${msg("password")}</label>
      <input id="password" name="password" type="password" autocomplete="current-password" />
    </div>

    <button class="btn-primary" type="submit">
      ${msg("doLogIn")}
    </button>

    <div class="actions">
      <#if realm.resetPasswordAllowed>
        <a href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a>
      </#if>
      <#if realm.registrationAllowed && !registrationDisabled??>
        <a href="${url.registrationUrl}">${msg("doRegister")}</a>
      </#if>
    </div>
  </form>
</@instaff.instaffPage>
