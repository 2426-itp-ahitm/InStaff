<#import "instaff-layout.ftl" as instaff>

<@instaff.instaffPage>
  <h1 class="title">${msg("updatePasswordTitle")}</h1>

  <form id="kc-update-password-form" action="${url.loginAction}" method="post">
    <#if message?? && message.summary??>
      <p class="notice">${message.summary}</p>
    </#if>
    <div class="field">
      <label for="password-new">${msg("passwordNew")}</label>
      <input id="password-new" name="password-new" type="password" autocomplete="new-password" />
    </div>

    <div class="field">
      <label for="password-confirm">${msg("passwordConfirm")}</label>
      <input id="password-confirm" name="password-confirm" type="password" autocomplete="new-password" />
    </div>

    <button class="btn-primary" type="submit">
      ${msg("doSubmit")}
    </button>
  </form>
</@instaff.instaffPage>
