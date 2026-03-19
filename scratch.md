we have a postgres database running via docker in the docker directory in postgres. create a bash script with docker compose exec to export the database to an sql file. put the sql file in the same folder as the database.

we need an android application with the same functionality than the ios application. the goal is to create a specification for codex first. i have time, i will listen to, don't make any assumptions, ask questions.

answers for your questions part 1:
1.: the android app should have the same functionality as the ios app, no additional functionality from the web app
2.: the android app is only for the employees, so they can use it directly on their phone and manager their shifts
3.: user flows for v1: login, view assignments, accept/decline assignment, profile/view + edit, role display + its description in the profile tab/view.
4.: yes list the ios screens and we confirm them together one by one.
5.: yes it should use the same backend api calls like the ios. from the "backend-new" quarkus backend.
6.: android login with keycloak same as in ios
7.: techstack for android java + layout xml
8.: goal is to generate only a written specification for codex
9.: step-by-step build brief for codex
10.: in the future we want to implement push notification when the employee is assigned to a shift + in the far future the employee should invite himself to the manager for a shift so he can ask if he can work in a specific shift
continue questioning until you understand completely

answers for your questions part 2:
1. yes
2. yes
3. yes
4. yes
5. yes
6. no
7. yes
8. yes
9. yes
10. yes keep the 3-tab-structure
11. home tab assignments from the current week
12. assignments sorted smart (assignments that haven't started should be sorted by the starttime ascending, assignments that already where (employee can't accept/decline them anymore) should be grey sorted in the same way, but at the end of the list) - so basicly a future+past mix in the same list
13. shift name, the date the start time and endtime the role and the confirmation status. when the day of the start and endtime is the same, it should be like 01.01.2026 10:00 - 15:00, if its not it should be like 01.01.2026 20:00 - 02.01.2026 03:00
14. everything, except hourly_wage, any company infos, any role infos (as well he shouldn't be able to give / remove roles for himself), manager flag
15. read only should be hourly_wage, company infos roles infos, exactky the ones that he can't edit
16. should be a list of the roles the employee has and the user can click on the role and then the info should appear (in a other view, where he can go back via a back button)
17. language should be german in future version we could implement a translation for englisch, but not for now
18. match functionality and use material (google like) style
19. implementation with classic android architecture
20. user should be able to view his shifts when he's offline but he should't be able to edit. so a info bar or something would be important if hes offline. so the login should be cached so he can login / be logged in if he's offline
21. support only dev backend
continue questioning until you understand completely

answers for your questions part 3:
1. confirmed = null : offen, true = angenommen, false = abgelehnt
2. should be not visible anymore and should be disabled
3. list of this weeks  assignment 
4. something like "diese woche hast du keine schichten" - or something better you can decide
5. section headers would be good but for the one that already started the newer ones should be at the top and the elder one at the end
6. for every assignment that it past it should be grey, ignoring if it was accepted declined or nothing
7. same fields but should only be able to edit when clicked on a button
8. no they should not autosave but if the user's currently editing and wants to navigate to a different page, a info should pop up that he has to cancel of save his changes
9. role name and role description
10. when the login was successfully the last time before, he should use cached data and a first ever login without internet is not possible
11. should have all the infos like he's online but with the cached data + he shouldn't be able to change / accept / decline or anything like that
12. he shouldn't be able to edit data when he's offline. disable all the buttons and add a info bar that says he's offline
13. top banner on all screens
14. single activity + fragments
15. give me some ideas which sdk's i can use, should be able to be used for most of the users
16. should be in a dir like android
17. InStaff should be the apps name
18. backend 8080/api and keycloak 8081
19. android should have no calender view. in the future, not now, we want to implement a feature where the user can export his shifts in his own calendar like google or outlook
20. the push notifications should be completely ignored at this point. in te future we want to use something where ur quarkus send ur clients a notification and they do the mobile notification
continue questioning until you understand completely

answers for your questions part 4:
1. yes, except for the assignment ones. no additional page is neede, all the infos from the assignment should be directly displayed in the list, where he can as well accept and declined
2. the assignments should be displayed with th infos directly in the list, same in home as in request /assignments view
3. correct
4. when abgelehnt it should display that in the status and show the annehmen button, when angenommen it should do it otherwise. like status is angenommen and button is ablehen
5. yes they can change their status until it started
6. yes
7. should be allowed, we will implement the change in keycloak later. for now we just don't edit the email
8. birthdate should have a date picker
9. all fields are required, valid email format, no telephone format, no minimum length
10. when offline the edit functionality should be disabled and not work
11. load again the online data for all screens and cache it again.
12. no refresh manually. in future versions it should refresh when a notification is send from the backend
13. something like "du hast gerade keine schichten"
14. simple vertical list
15. generic german error message
16. android 8.0 so minSdk 26
17. what do you mean by portrait-only in v1?
18. yes, but not as big as in the ios app
19. no when the token is expired, the user should be able to login but only in read-only mode
20. yes add the future proofing list
continue questioning until you understand completely

answers for your questions part 5:
1. should have upright and landscape layout
2. B. but if the token has expired and the user is online, he should have to login again
3. show offline session state
4. correct behavior
5. status should be shown for past assignments without the buttons
6. overlap the current week in any way
7. monday to sunday
8. sort is correct, both with headers
9. email field is readonly for now
10. same warning for all three cases
11. "Speichere deine Änderungen bevor du die Seite wechselst / dich abmeldest", je nachdem was gerade gemacht wird
12. yes it should
13. daten konnten nicht geladen werden. bitte versuche es erneut. sounds good to me
14. no these three are good, add an icon for each label
15. no login, then load the data and only after that worked correct the tabs should be shown
continue questioning until you understand completely

answers for your questions part 6:
1. i create you a folder for android and give you the project but empty and you give me the code then
2. retrofit for rest, gson for json, appauth for login the rest can you deside whats best for my context
3. lets not implement / add the cache versions. if the user is offline he should not be able to login, only if hes back online
4. no encrpyted local storage
5. dedicated loading screen with something like "wir bereiten alles für sie vor"
6. inline
7. correct difference
8. company name, offline status banner is not needed anymore because we have no offline anymore, logout button
9. company name should be shown
10. separate fragment
11. standard material icons are fine
12. no just responsive rearrangement for the landscape layout
13. standard tests for sorting and formatting, no more
14. an readme with all important informations
15. intended employee functionality that i've described
continue questioning until you understand completely

answers for your questions part 7:
1. correct. no offline mode at all in v1
2. force the user back to login
3. i confirm your assumes for session/token handling and no assignment/profile caching
4. confirm the read-only and editing data
5. correct buttons and statuses. statuses have yellow/orange or so for offen, green for angenommen and red for abgelehnt
6. grey styling plus section header. statuses as well in grey
7. yes but i would call it "Aktuelle Anfragen"
8. good for me
9. polished german wording
10. speichern verwerfen and abbrechen
11. show the unsaved changes dialog, then a confirm logout if he presses verwerden dialog and then logout
12. yes
13. okay for me
14. i create the application, but empty and you do the rest
15. correct
continue questioning until you understand completely

answers for your questions part 8:
1. correct
2. skip login if valid session exists
3. no the session should be verlängert if thats possible
4. logo as well from instaff
5. good
6. good
7. yes
8. yes, next to each other in one line
9. last 30 days
10. yes
11. yes with validation messages
12. normal but non editable
13. sinple text row is good but in its own section that says "Firmeninformationen"
14. yes second dialog
15. yes
continue questioning until you understand completely

answers for your questions part 9:
1. silent token refresh
2. return to login screen
3. yes
4. overlapping ones, just the ones that are bevorstehend, no vergangen assignments
5. future assignments for the next 30 days and past assignments for the last 30 days
6. yes
7. okay for me
8. yes
9. perfect style for me
10. 10,00 EUR / Stunde is good
11. same functionality and same style
12. include all that you've said
13. tests sound good
13. Dienste is good
continue questioning until you understand completely

answers for your questions part 10:
1 - 4 yes
5. after  serverresponse
6. yes
7. no embedded webview
8. no is not necessary
9. vorhandene verwenden
10. yes
continue questioning until you understand completely

answers for your questions part 11:
1. yes
2. alle felder senden
3. deutsche ui texte
4. yes
5. yes
6. english
continue questioning until you understand completely

answers for your questions part 12:
1. B
2. last loaded backend emplyoee object
3. spec in english but ui in german
continue questioning until you understand completely

