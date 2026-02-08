<#import "instaff-layout.ftl" as instaff>

<@instaff.instaffPage>
  <h1 class="title">${msg("infoTitle")}</h1>
  <#if message?? && message.summary??>
    <p>${message.summary}</p>
  </#if>

  <#if pageRedirectUri??>
    <a class="btn-primary" href="${pageRedirectUri}">
      ${msg("proceed")}
    </a>
  <#else>
    <a class="btn-primary" href="${url.loginUrl}">
      ${msg("backToLogin")}
    </a>
  </#if>
</@instaff.instaffPage>
