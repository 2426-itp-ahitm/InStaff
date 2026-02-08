<#import "instaff-layout.ftl" as instaff>

<@instaff.instaffPage>
  <h1 class="title">${msg("errorTitle")}</h1>
  <#if message?? && message.summary??>
    <p>${message.summary}</p>
  </#if>

  <a class="btn-primary" href="${url.loginUrl}">
    ${msg("backToLogin")}
  </a>
</@instaff.instaffPage>
