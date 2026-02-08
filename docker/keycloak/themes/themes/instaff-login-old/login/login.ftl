<#import "template.ftl" as layout>

<@layout.registrationLayout displayInfo=true displayMessage=true; section>
    <#if section = "form">
        <h1 class="title">${msg("loginTitle")}</h1>

        <form id="kc-form-login" action="${url.loginAction}" method="post">
            <div class="field">
                <label for="username">${msg("username")}</label>
                <input id="username" name="username" type="text" autofocus />
            </div>

            <div class="field">
                <label for="password">${msg("password")}</label>
                <input id="password" name="password" type="password" />
            </div>

            <button class="btn-primary" type="submit">
                ${msg("doLogIn")}
            </button>
        </form>
    </#if>
</@layout.registrationLayout>