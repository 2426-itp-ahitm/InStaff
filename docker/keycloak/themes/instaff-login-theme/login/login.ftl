<#import "instaff-layout.ftl" as instaff>

<@instaff.instaffPage>
  <h1 class="title">${msg("loginTitle")}</h1>

  <form id="kc-form-login" action="${url.loginAction}" method="post">
    
    <div class="field">
      <label for="username">${msg("username")}</label>
      <input
        id="username"
        name="username"
        type="text"
        autofocus
        autocomplete="username"
        value="${(login.username!'')}"
      />
    </div>

    <div class="field">
      <label for="password">${msg("password")}</label>
      <input id="password" name="password" type="password" autocomplete="current-password" />
    </div>

    <#if message??>
      <#if message.summary?contains("user_not_found")>
        <div class="error">Benutzer existiert nicht.</div>
      <#elseif message.summary?contains("invalid_user_credentials")>
        <div class="error">Passwort ist falsch.</div>
      <#else>
        <div class="error">${message.summary}</div>
      </#if>
    </#if>  


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
