<#import "template.ftl" as layout>

<@layout.registrationLayout displayMessage=true; section>
    <#if section = "title">
        Login
    <#elseif section = "form">
        <form action="${url.loginAction}" method="post">
            <div class="field">
                <label for="username">Benutzername</label>
                <input id="username" name="username" type="text" autofocus />
            </div>

            <div class="field">
                <label for="password">Passwort</label>
                <input id="password" name="password" type="password" />
            </div>

            <button type="submit" class="btn-primary">
                Login
            </button>
        </form>
    </#if>
</@layout.registrationLayout>