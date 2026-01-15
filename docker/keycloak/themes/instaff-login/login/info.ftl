<#import "template.ftl" as layout>

<@layout.registrationLayout displayMessage=true; section>
    <#if section = "header">
        ${msg("infoTitle")}
    <#elseif section = "form">
        <div class="card">
            <#if message?has_content>
                <div class="alert alert-info">
                    ${message.summary}
                </div>
            </#if>

            <#if pageRedirectUri?has_content>
                <a class="btn-primary" href="${pageRedirectUri}">
                    ${msg("backToApplication")}
                </a>
            </#if>
        </div>
    </#if>
</@layout.registrationLayout>