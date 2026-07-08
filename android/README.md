# InStaff Android

Employee-facing Android app for InStaff, built with Java, XML, Material Components, Retrofit, and AppAuth.

## Scope

This app is for employees only. It supports:

- Keycloak login
- Current-week upcoming assignment overview
- Assignment list for the next 30 days and previous 30 days
- Accept / decline assignment
- Profile view and edit
- Role detail view
- Logout

Out of scope for v1:

- Manager functionality
- Offline mode
- Push notifications
- Calendar export
- Employee self-request / self-invite
- English localization

## Stack

- Java
- XML layouts
- Single Activity + Fragments
- ViewModel + Repository
- Retrofit + Gson
- AppAuth for Android
- Material Components

## SDK / Tooling

- Min SDK: 26
- Android Studio with a current Android Gradle Plugin compatible setup

## Dev Environment

Debug builds target local development services through the Android emulator:

- Backend API: `http://10.0.2.2:8080/api`
- Keycloak: `http://10.0.2.2:8081`

Make sure:

- the Quarkus backend in `backend-new` is running
- Keycloak from the local Docker setup is running
- the emulator can reach both services on `10.0.2.2`

## Release APK Environment

Release builds target the deployed test environment for manual APK installation:

- Backend API: `https://it210157.cloud.htl-leonding.ac.at/api/`
- Keycloak: `https://it210157.cloud.htl-leonding.ac.at/auth`

The URLs are defined as Gradle `BuildConfig` fields in `app/build.gradle.kts`.
Changing the release target only requires updating the `release` build type values there.

The Keycloak client `instaff-android` must allow the redirect URI
`at.htlleonding.instaff://oauth2redirect`. The realm export already contains this client in
`docker/keycloak/realm-export.json`, but existing Keycloak databases do not auto-update from that file;
re-import the realm or update the client manually if prod was already running.

## Authentication

- Login uses Keycloak through AppAuth
- Login opens an external browser / custom tab
- Embedded WebView is not used
- A stored session skips the login screen
- Silent token refresh is attempted when possible
- If refresh fails, the user is returned to login

## Architecture

Suggested package layout:

- `auth`
- `data/api`
- `data/model`
- `data/repository`
- `ui/login`
- `ui/loading`
- `ui/main`
- `ui/home`
- `ui/shifts`
- `ui/profile`
- `util`

## Main Screens

- `Aktuelle Anfragen`: upcoming assignments that overlap the current week
- `Dienste`: upcoming assignments for the next 30 days and past assignments from the last 30 days
- `Profil`: employee profile, company information, role list, logout

## Branding

Reuse existing InStaff assets from the repository where possible. The current Android implementation reuses the existing logo asset from the frontend public assets.

## Tests

Unit tests cover:

- date/time formatting
- current-week filtering
- 30-day upcoming/past filtering
- sorting rules
- started/past assignment logic

## Known Limitations

- Debug builds support emulator-based local development only
- No offline mode or local data cache in v1
- No push notifications in v1

## Future Work

- Push notifications
- Calendar export
- Employee self-request / self-invite for shifts
- English localization
