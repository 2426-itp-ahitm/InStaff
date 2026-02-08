<#import "template.ftl" as layout>

<@layout.registrationLayout displayInfo=true displayMessage=true; section>
    <#if section = "header">
    <#elseif section = "form">
        <div class="page">
            <div class="card">
                <img src="${url.resourcesPath}/logo-black.svg" class="logo" alt="Logo" />
                <#nested "form">
            </div>
        </div>
    </#if>
</@layout.registrationLayout>