<#import "template.ftl" as layout>

<@layout.registrationLayout displayMessage=true; section>
    <#if section = "title">
        Passwort ändern
    <#elseif section = "header">
        <h1 class="title">Passwort ändern</h1>
    <#elseif section = "form">
        <form action="${url.loginAction}" method="post">

            <div class="field">
                <label for="password-new">Neues Passwort</label>
                <input id="password-new"
                       name="password-new"
                       type="password"
                       autofocus
                       required />
            </div>

            <div class="field">
                <label for="password-confirm">Passwort bestätigen</label>
                <input id="password-confirm"
                       name="password-confirm"
                       type="password"
                       required />
            </div>

            <button type="submit" class="btn-primary">
                Passwort speichern
            </button>

        </form>
    </#if>
</@layout.registrationLayout>