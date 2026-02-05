<#import "template.ftl" as layout>

<@layout.registrationLayout displayMessage=false; section>
    <#if section = "title">
        Sitzung abgelaufen
    <#elseif section = "header">
        <h1 class="title">Sitzung abgelaufen</h1>
    <#elseif section = "form">
        <p style="text-align:center; color: var(--muted); margin-bottom: 2rem;">
            Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.
        </p>

        <a href="${url.loginUrl}"
           class="btn-primary"
           style="text-decoration:none; text-align:center; display:block;">
            Erneut anmelden
        </a>
    </#if>
</@layout.registrationLayout>