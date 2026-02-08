<#import "template.ftl" as base>

<#macro instaffPage>
  <@base.registrationLayout displayInfo=false displayMessage=false; section>
    <#if section == "form">
      <div class="page">
        <div class="card">
          <img src="${url.resourcesPath}/logo-black.svg" class="logo" alt="Instaff" />
          <#nested>
        </div>
      </div>
    </#if>
  </@base.registrationLayout>
</#macro>