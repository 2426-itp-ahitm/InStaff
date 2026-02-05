<#import "template.ftl" as layout>

<@layout.registrationLayout displayMessage=true; section>
    <#if section = "title">
        Information
    <#elseif section = "header">
        <h1 class="title">
            <#if message?? && message.summary??>
                ${message.summary}
            <#else>
                Information
            </#if>
        </h1>
    <#elseif section = "form">

        <#if message?has_content>
            <p style="text-align:center; color: var(--muted); margin-bottom: 2rem;">
                ${message.summary}
            </p>
        </#if>

        <#if pageRedirectUri?has_content>
            <a href="${pageRedirectUri}"
               class="btn-primary"
               style="text-decoration:none; text-align:center; display:block;">
                Zurück zur Anwendung
            </a>
        </#if>

    </#if>
</@layout.registrationLayout>