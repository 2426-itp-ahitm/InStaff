<#import "template.ftl" as layout>

<@layout.registrationLayout displayInfo=true displayMessage=true; section>
    <#if section = "title">
        ${msg("emailVerifyTitle")}
    <#elseif section = "header">
        ${msg("emailVerifyTitle")}
    <#elseif section = "form">
        <p>${msg("emailVerifyInstruction1")}</p>
    </#if>
</@layout.registrationLayout>