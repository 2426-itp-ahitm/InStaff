# Commands

**git change branch** \
man möchte in den branch _development_ wechseln
`git checkout development`

**git merge branch** \
man muss in dem branch sein wo es hinein kommen soll. Bsp: man ist in main und möchte development "hineinkopieren":  `git merge development`

**move npm cache** \
`mv ~/.npm ~/.old_npm `

**clean npm cache** \
`npm cache clean --force`

**reinstall node_modules**\
`rm -rf node_modules package-lock.json `\
`npm install`\
`npm start`

**all three combined and run**\
`rm -rf node_modules/.cache && rm -rf target && npm run build`

**if git pull is very slow**\
benutzt IPv4 statt manchmal IPv6\
`git pull -4`

**force remove dir with files init**
`rm -rf dir`