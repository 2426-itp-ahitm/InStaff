<#import "template.ftl" as layout>

<@layout.registrationLayout displayMessage=false; section>
    <#if section = "title">
        Fehler
    <#elseif section = "header">
        <h1 class="title">Ein Fehler ist aufgetreten</h1>
    <#elseif section = "form">
        <p style="text-align:center; color: var(--muted); margin-bottom: 2rem;">
            <#if message?? && message.summary??>
                ${message.summary?no_esc}
            <#else>
                Ein unerwarteter Fehler ist aufgetreten.
            </#if>
        </p>

        <a href="${url.loginUrl}"
           class="btn-primary"
           style="text-decoration:none; text-align:center; display:block;">
            Zurück zum Login
        </a>
    </#if>
</@layout.registrationLayout>