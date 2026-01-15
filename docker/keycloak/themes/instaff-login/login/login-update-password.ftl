<!DOCTYPE html>
<html>
<head>
  <title>Passwort ändern</title>
  <link rel="stylesheet" href="${url.resourcesPath}/styles.css">
</head>
<body>
<div class="page">
  <div class="card">

    <div class="logo-wrapper">
      <img src="${url.resourcesPath}/logo-black.svg" alt="Instaff Logo" class="logo">
    </div>

    <h1 class="title">Passwort ändern</h1>

    <form action="${url.loginAction}" method="post">

      <div class="field">
        <label for="password-new">Neues Passwort</label>
        <input id="password-new" name="password-new" type="password" autofocus required />
      </div>

      <div class="field">
        <label for="password-confirm">Passwort bestätigen</label>
        <input id="password-confirm" name="password-confirm" type="password" required />
      </div>

      <button type="submit" class="btn-primary">
        Passwort speichern
      </button>

    </form>

  </div>
</div>
</body>
</html>