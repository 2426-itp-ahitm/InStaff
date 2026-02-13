<#import "instaff-layout.ftl" as instaff>

<@instaff.instaffPage>
  <h1 class="title">${msg("emailVerifyTitle")}</h1>
  <p>${msg("emailVerifyInstruction1")}</p>
  <#if user.email??>
    <div class="notice">${user.email}</div>
  </#if>
  <p>${msg("emailVerifyInstruction2")}</p>

  <div class="actions" style="justify-content:center">
    <a href="${url.loginUrl}">${msg("backToLogin")}</a>
  </div>
</@instaff.instaffPage>
