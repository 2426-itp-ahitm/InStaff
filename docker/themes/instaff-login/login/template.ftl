<#-- 
  Base layout for all login-related pages
  Compatible with Keycloak 26+
-->

<#macro registrationLayout displayInfo=false displayMessage=true>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>
        <#nested "title">
    </title>

    <link rel="stylesheet" href="${url.resourcesPath}/styles.css">
</head>
<body>

<div class="page">
    <div class="card">

        <div class="logo-wrapper">
            <img src="${url.resourcesPath}/logo-black.svg"
                 alt="Instaff Logo"
                 class="logo">
        </div>

        <#-- Optional header/title -->
        <#if nested?has_content>
            <#nested "header">
        </#if>

        <#-- Messages (errors, info, success) -->
        <#if displayMessage && message?has_content>
            <div class="message ${message.type}">
                ${message.summary}
            </div>
        </#if>

        <#-- Main form/content -->
        <#nested "form">

        <#-- Optional info section -->
        <#if displayInfo>
            <div class="info">
                <#nested "info">
            </div>
        </#if>

    </div>
</div>

</body>
</html>
</#macro>