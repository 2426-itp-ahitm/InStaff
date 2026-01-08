<!DOCTYPE html>
<html>
<head>
  <title>My Login</title>
  <link rel="stylesheet" href="${url.resourcesPath}/styles.css">
</head>
<body>
<div class="page">
    <div class="card">
    <div class="logo-wrapper">
        <img src="${url.resourcesPath}/logo-black.svg" alt="Instaff Logo" class="logo">
    </div>

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
    </div>
</div>
</body>
</html>