<#import "instaff-layout.ftl" as instaff>

<@instaff.instaffPage>
  <h1 class="title">${msg("pageExpiredTitle")}</h1>
  <p>${msg("pageExpiredMsg1")}</p>
  <p>${msg("pageExpiredMsg2")}</p>

  <a class="btn-primary" href="${url.loginUrl}">
    ${msg("doLogIn")}
  </a>
</@instaff.instaffPage>
