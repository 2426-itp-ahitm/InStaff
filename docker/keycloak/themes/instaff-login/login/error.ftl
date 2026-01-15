<!DOCTYPE html>
<html>
<head>
  <title>Fehler</title>
  <link rel="stylesheet" href="${url.resourcesPath}/styles.css">
</head>
<body>
<div class="page">
  <div class="card">

    <div class="logo-wrapper">
      <img src="${url.resourcesPath}/logo-black.svg" alt="Instaff Logo" class="logo">
    </div>

    <h1 class="title">Ein Fehler ist aufgetreten</h1>

    <p style="text-align:center; color: var(--muted); margin-bottom: 2rem;">
      <#if message?? && message.summary??>
        ${message.summary?no_esc}
      <#else>
        <p>An unexpected error occurred.</p>
      </#if>    
    </p>

    <a href="${url.loginUrl}" class="btn-primary" style="text-decoration:none; text-align:center; display:block;">
      Zurück zum Login
    </a>

  </div>
</div>
</body>
</html>