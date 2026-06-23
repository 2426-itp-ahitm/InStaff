# InStaff Company Setup – vollständiger Umsetzungsplan

## 1. Ziel des Company Setups

Das Company Setup dient dazu, eine neue Firma strukturiert in InStaff anzulegen.

Eine interne berechtigte Person erstellt eine Setup-Einladung. Der Kunde erhält per E-Mail einen Link und ein Setup-Passwort. Nach Eingabe des Passworts wird eine Company im Status `SETUP` erstellt. Der Kunde durchläuft danach einen Wizard und legt Unternehmensdaten, Öffnungszeiten, den ersten Manager/Owner und optional Rollen, Schichtvorlagen sowie Mitarbeiter an.

Nach Abschluss wird die Company aktiviert, der Owner als Employee gespeichert, als Company-Owner gesetzt und in Keycloak als Manager-Benutzer angelegt.

---

# 2. Grundlegender Flow

## 2.1 Interner Ablauf

1. Interne berechtigte Person öffnet das Admin-Layout.
2. Dort wird eine neue Setup-Einladung erstellt.
3. Eingaben:
   - E-Mail-Adresse des Kunden/Managers
   - vorläufiger Firmenname
4. Backend generiert:
   - Setup-Token
   - Setup-Passwort
   - Passwort-Hash
5. System sendet eine E-Mail mit:
   - Setup-Link
   - Setup-Passwort
6. Die Einladung erscheint in der internen Setup-Übersicht.

---

## 2.2 Kunden-Ablauf

1. Kunde öffnet den Setup-Link.
2. Kunde gibt das Setup-Passwort ein.
3. Backend prüft Token und Passwort.
4. Backend erstellt:
   - Company mit `status = SETUP`
   - Setup-Session mit 3 Stunden Gültigkeit
5. Kunde durchläuft den Setup-Wizard.
6. Kunde schließt das Setup ab.
7. Backend erstellt nach Abschluss:
   - Company-Daten
   - Owner-Employee
   - Keycloak-User
   - Keycloak-Rolle `user-is-manager`
8. Company wird auf `ACTIVE` gesetzt.
9. Keycloak sendet die Passwort-Setzen-Mail.

---

# 3. Layout-Struktur im Frontend

## 3.1 Public Layout

Für öffentlich erreichbare Seiten.

Enthält:

- SaaS-Infoseite
- Login-Seite
- Setup-Link-Seite
- Setup-Passwortseite
- Company-Setup-Wizard

---

## 3.2 Private Layout

Für eingeloggte Kunden/Manager.

Enthält:

- Dashboard
- Kalender
- Mitarbeiterverwaltung
- Rollenverwaltung
- Schichtverwaltung
- Schichtvorlagen
- normale Company-Einstellungen

---

## 3.3 Admin Layout

Für interne berechtigte Personen.

Keycloak-Rolle:

```text
user-is-internal-admin
```

Enthält:

- Company-Übersicht
- Setup-Einladungen / Company Create Requests
- Deaktivieren von Setup-Einladungen
- erneutes Senden von Setup-E-Mails
- interne Company-Verwaltung

---

# 4. Keycloak-Rollen

## 4.1 Interne Admin-Rolle

```text
user-is-internal-admin
```

Darf:

- Setup-Einladungen erstellen
- Setup-Einladungen erneut senden
- Setup-Einladungen deaktivieren
- Companies intern anzeigen
- interne Admin-Seiten verwenden

---

## 4.2 Manager-Rolle

```text
user-is-manager
```

Wird beim Setup-Abschluss automatisch dem ersten Manager/Owner zugewiesen.

Darf nach Login:

- Private App verwenden
- Company verwalten
- Rollen verwalten
- Mitarbeiter verwalten
- Schichten verwalten
- Kalender verwenden

---

# 5. Backend-Sicherheitskonzept

## 5.1 Normale Endpunkte

Normale Company-Endpunkte bleiben Keycloak-geschützt.

Beispiel:

```text
POST /api/companies
```

Dieser Endpunkt darf nicht öffentlich werden.

Normale Endpunkte prüfen:

- Keycloak-Token gültig
- Benutzer hat passende Rolle
- Benutzer gehört zur passenden Company

---

## 5.2 Setup-Endpunkte

Das Setup bekommt eigene Endpunkte.

Diese sind nicht durch Manager-Login geschützt, weil der Manager zu diesem Zeitpunkt noch keinen Keycloak-User hat.

Setup-Endpunkte werden geschützt durch:

- Setup-Token
- Setup-Passwort
- Setup-Session

Nach richtiger Passworteingabe bekommt das Frontend eine Setup-Session. Diese Session wird bei weiteren Setup-Requests mitgeschickt.

Empfohlen:

```text
X-Setup-Session: <session-token>
```

Jeder Setup-Endpunkt prüft:

- Session existiert
- Session ist aktiv
- Session ist nicht abgelaufen
- Invite ist `OPEN` oder `IN_PROGRESS`
- Company gehört zur Invite
- Company hat `status = SETUP`

Wichtig:

Das Frontend darf keine beliebige `companyId` schicken, der das Backend vertraut. Die Company muss immer über die Setup-Session ermittelt werden.

---

# 6. Setup-Invite Entity

## 6.1 Entity: CompanySetupInvite

Vorgeschlagene Felder:

```java
@Entity
public class CompanySetupInvite extends PanacheEntity {
    @Column(name = "recipient_email", nullable = false)
    public String recipientEmail;

    @Column(name = "preliminary_company_name", nullable = false)
    public String preliminaryCompanyName;

    @Column(name = "setup_token", nullable = false, unique = true)
    public String setupToken;

    @Column(name = "setup_password_hash", nullable = false)
    public String setupPasswordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    public CompanySetupInviteStatus status = CompanySetupInviteStatus.OPEN;

    @OneToOne
    @JoinColumn(name = "company_id")
    public Company company;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    @Column(name = "created_by")
    public String createdBy;

    @Column(name = "completed_at")
    public LocalDateTime completedAt;

    @Column(name = "disabled_at")
    public LocalDateTime disabledAt;

    @Column(name = "disabled_by")
    public String disabledBy;

    @Column(name = "failed_attempts", nullable = false)
    public int failedAttempts = 0;

    @Column(name = "locked_until")
    public LocalDateTime lockedUntil;

    public CompanySetupInvite() {}
}
```

---

## 6.2 Enum: CompanySetupInviteStatus

```java
public enum CompanySetupInviteStatus {
    OPEN,
    IN_PROGRESS,
    COMPLETED,
    DISABLED,
    DELETED,
    LOCKED
}
```

Hinweis:

`DELETED` bedeutet logisch gelöscht. Es wird nicht hart aus der Datenbank gelöscht.

---

# 7. Setup-Session Entity

## 7.1 Entity: CompanySetupSession

```java
@Entity
public class CompanySetupSession extends PanacheEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "invite_id")
    public CompanySetupInvite invite;

    @Column(name = "session_token_hash", nullable = false)
    public String sessionTokenHash;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    public LocalDateTime expiresAt;

    @Column(name = "last_used_at")
    public LocalDateTime lastUsedAt;

    @Column(name = "active", nullable = false)
    public boolean active = true;

    public CompanySetupSession() {}
}
```

Session-Gültigkeit:

```text
3 Stunden
```

Nach Ablauf muss der Kunde das Setup-Passwort erneut eingeben oder den Setup-Vorgang neu starten.

---

# 8. Company Entity erweitern

Aktuelle Entity:

```java
@Entity
public class Company extends PanacheEntity {
    @Column(name = "company_name")
    public String companyName;

    public Company() {}

    public Company(String companyName) {
        this.companyName = companyName;
    }
}
```

Erweiterte Version:

```java
@Entity
public class Company extends PanacheEntity {
    @Column(name = "company_name", nullable = false)
    public String companyName;

    @Column(name = "industry")
    public String industry;

    @Column(name = "uid_number")
    public String uidNumber;

    @Column(name = "public_email")
    public String publicEmail;

    @Column(name = "public_telephone")
    public String publicTelephone;

    @Column(name = "address")
    public String address;

    @Column(name = "location_name")
    public String locationName;

    @Column(name = "contact_person_name")
    public String contactPersonName;

    @Column(name = "contact_person_email")
    public String contactPersonEmail;

    @Column(name = "contact_person_telephone")
    public String contactPersonTelephone;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    public CompanyStatus status = CompanyStatus.SETUP;

    @ManyToOne
    @JoinColumn(name = "owner_employee_id")
    public Employee ownerEmployee;

    public Company() {}

    public Company(String companyName) {
        this.companyName = companyName;
        this.status = CompanyStatus.SETUP;
    }
}
```

---

## 8.1 Enum: CompanyStatus

```java
public enum CompanyStatus {
    SETUP,
    ACTIVE,
    DISABLED
}
```

---

# 9. Company Setup DTO

## 9.1 CompanySetupCompanyDTO

```java
public record CompanySetupCompanyDTO(
        String companyName,
        String industry,
        String uidNumber,
        String publicEmail,
        String publicTelephone,
        String address,
        String locationName,
        String contactPersonName,
        String contactPersonEmail,
        String contactPersonTelephone
) {
}
```

Pflichtfelder:

- Firmenname
- Branche
- UID-Nummer
- öffentliche E-Mail
- öffentliche Telefonnummer
- Adresse
- Standortname
- Hauptansprechpartner Name
- Hauptansprechpartner E-Mail
- Hauptansprechpartner Telefonnummer

---

# 10. Öffnungszeiten

## 10.1 Entity: CompanyOpeningHour

```java
@Entity
public class CompanyOpeningHour extends PanacheEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "company_id")
    public Company company;

    @Enumerated(EnumType.STRING)
    @Column(name = "weekday", nullable = false)
    public DayOfWeek weekday;

    @Column(name = "is_closed", nullable = false)
    public boolean isClosed;

    @Column(name = "start_time")
    public LocalTime startTime;

    @Column(name = "end_time")
    public LocalTime endTime;

    public CompanyOpeningHour() {}
}
```

---

## 10.2 DTO: OpeningHourCreateDTO

```java
public record OpeningHourCreateDTO(
        DayOfWeek weekday,
        boolean isClosed,
        LocalTime startTime,
        LocalTime endTime
) {
}
```

---

## 10.3 DTO: OpeningHoursUpdateDTO

```java
public record OpeningHoursUpdateDTO(
        List<OpeningHourCreateDTO> openingHours
) {
}
```

Regel:

Für jeden Wochentag muss genau ein Eintrag vorhanden sein.

Pro Tag gilt:

```text
geschlossen
oder
Startzeit + Endzeit
```

Sonderregeln wie „letzter Sonntag im Monat geschlossen“ kommen nicht ins Setup. Sie werden später im normalen System umgesetzt.

---

# 11. Rechtliche Bestätigung

## 11.1 Entity: CompanyLegalConfirmation

```java
@Entity
public class CompanyLegalConfirmation extends PanacheEntity {
    @OneToOne(optional = false)
    @JoinColumn(name = "company_id")
    public Company company;

    @Column(name = "data_is_correct", nullable = false)
    public boolean dataIsCorrect;

    @Column(name = "authorized_to_register_company", nullable = false)
    public boolean authorizedToRegisterCompany;

    @Column(name = "accepted_privacy_policy", nullable = false)
    public boolean acceptedPrivacyPolicy;

    @Column(name = "accepted_terms", nullable = false)
    public boolean acceptedTerms;

    @Column(name = "confirmed_by_email")
    public String confirmedByEmail;

    @Column(name = "confirmed_at")
    public LocalDateTime confirmedAt;

    public CompanyLegalConfirmation() {}
}
```

---

## 11.2 DTO: LegalConfirmationDTO

```java
public record LegalConfirmationDTO(
        boolean dataIsCorrect,
        boolean authorizedToRegisterCompany,
        boolean acceptedPrivacyPolicy,
        boolean acceptedTerms
) {
}
```

Alle Checkboxen sind Pflicht.

---

# 12. Employee / Owner

## 12.1 Bestehender EmployeeCreateDTO

```java
public record EmployeeCreateDTO(
        String firstname,
        String lastname,
        String email,
        String telephone,
        @JsonProperty("birthdate")
        @JsonAlias("birthDate")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate birthDate,
        boolean isManager,
        List<Long> roles,
        double hourlyWage,
        String address,
        boolean isActive,
        boolean isSelfManaged
) {
}
```

---

## 12.2 Owner-Regeln

Der erste Manager wird über diesen DTO erstellt.

Für den Owner im Setup gilt:

```text
isManager = true
isActive = true
isSelfManaged = true
roles = optional oder leer
```

Nach Erstellung:

```text
Company.ownerEmployee = createdEmployee
```

Beim Setup-Abschluss wird ein Keycloak-User erstellt und diesem die Rolle `user-is-manager` gegeben.

Die E-Mail des Owner-Employees ist die spätere Login-E-Mail.

Die Invite-E-Mail kann im Owner-Schritt vorausgefüllt werden, darf aber geändert werden.

---

# 13. Rollen

## 13.1 Bestehender RoleCreateDTO

```java
public record RoleCreateDTO(
        String roleName,
        String description
) {
}
```

Rollen sind im Setup optional.

Im Wizard:

- Schritt ist überspringbar
- Einträge werden über ein Formular/Modal erstellt
- Einträge werden direkt in der DB gespeichert
- Änderungen werden über PUT/PATCH aktualisiert

---

# 14. Schichtvorlagen

## 14.1 ShiftTemplateCreateDTO

```java
public record ShiftTemplateCreateDTO(
        String shiftTemplateName,
        List<TemplateRoleCreateDTO> templateRoles
) {
}
```

---

## 14.2 TemplateRoleCreateDTO

```java
public record TemplateRoleCreateDTO(
        long roleId,
        int count
) {
}
```

Bedeutung:

Eine Schichtvorlage enthält beliebig viele Rollen mit jeweiliger Anzahl.

Beispiel:

```text
Schichtvorlage: Abendbetrieb
- Kellner: 3
- Küche: 1
- Bar: 1
```

---

## 14.3 Entity: ShiftTemplate

```java
@Entity
public class ShiftTemplate extends PanacheEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "company_id")
    public Company company;

    @Column(name = "shift_template_name", nullable = false)
    public String shiftTemplateName;

    public ShiftTemplate() {}
}
```

---

## 14.4 Entity: ShiftTemplateRole

```java
@Entity
public class ShiftTemplateRole extends PanacheEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "shift_template_id")
    public ShiftTemplate shiftTemplate;

    @ManyToOne(optional = false)
    @JoinColumn(name = "role_id")
    public Role role;

    @Column(name = "count", nullable = false)
    public int count;

    public ShiftTemplateRole() {}
}
```

---

# 15. Setup-Wizard im Frontend

## 15.1 Grundstruktur

Route:

```text
/company-setup/:token
```

Ablauf:

```text
Passwortseite
↓
Wizard mit Stepper und Progress Bar
```

---

## 15.2 Wizard-Schritte

```text
1. Unternehmensdaten
2. Managerdaten / Owner
3. Öffnungszeiten
4. Rollen
5. Schichtvorlagen
6. Mitarbeiter
7. Rechtliche Bestätigung
8. Zusammenfassung
9. Abschließen
```

---

## 15.3 Pflichtschritte

Nicht überspringbar:

- Unternehmensdaten
- Managerdaten / Owner
- Öffnungszeiten
- rechtliche Bestätigung
- Zusammenfassung / Abschluss

---

## 15.4 Optionale Schritte

Überspringbar:

- Rollen
- Schichtvorlagen
- weitere Mitarbeiter

In der Zusammenfassung werden übersprungene Schritte angezeigt:

```text
Rollen: nicht eingerichtet
Kann später im System nachgeholt werden.
```

---

## 15.5 Erklärungstexte

Kein Modal.

Stattdessen kurzer Infobereich oben bei komplexeren Schritten.

Schritte mit Erklärung:

- Öffnungszeiten
- Rollen
- Schichtvorlagen
- Mitarbeiter

Beispiel Rollen:

```text
Rollen beschreiben Tätigkeiten in Ihrem Unternehmen, z. B. Service, Küche oder Bar. Sie können Rollen später für Schichten und Mitarbeiter verwenden.
```

---

# 16. REST-Endpunkte

## 16.1 Admin-Endpunkte

Keycloak-geschützt mit Rolle:

```text
user-is-internal-admin
```

### Setup-Einladung erstellen

```text
POST /api/admin/company-setup/invites
```

Body:

```java
public record CompanySetupInviteCreateDTO(
        String recipientEmail,
        String preliminaryCompanyName
) {
}
```

---

### Setup-Einladungen anzeigen

```text
GET /api/admin/company-setup/invites
```

---

### Setup-Einladung erneut senden

```text
POST /api/admin/company-setup/invites/{id}/resend
```

---

### Setup-Einladung deaktivieren

```text
PUT /api/admin/company-setup/invites/{id}/disable
```

Setzt:

```text
Invite.status = DISABLED
Company.status = DISABLED, falls Company bereits existiert
```

---

### Setup-Einladung logisch löschen

```text
PUT /api/admin/company-setup/invites/{id}/delete
```

Setzt:

```text
Invite.status = DELETED
Company.status = DISABLED, falls Company bereits existiert
```

Hartes Löschen wird nicht verwendet.

---

### Company-Übersicht

```text
GET /api/admin/companies
```

Zeigt auch SETUP- und DISABLED-Companies.

---

## 16.2 Public Setup-Endpunkte

### Setup-Link prüfen

```text
GET /api/company-setup/{token}
```

Antwort nur minimal:

```json
{
  "valid": true
}
```

Keine sensiblen Daten zurückgeben.

---

### Setup-Login

```text
POST /api/company-setup/{token}/login
```

Body:

```java
public record CompanySetupLoginDTO(
        String password
) {
}
```

Backend macht:

1. Invite anhand Token suchen
2. Status prüfen
3. Lock prüfen
4. Passwort prüfen
5. Company erstellen, falls noch nicht vorhanden
6. Invite auf `IN_PROGRESS` setzen
7. Setup-Session erstellen
8. Session-Token zurückgeben

Antwort:

```java
public record CompanySetupSessionDTO(
        String setupSessionToken
) {
}
```

---

## 16.3 Setup-Session-Endpunkte

Alle folgenden Endpunkte brauchen:

```text
X-Setup-Session: <session-token>
```

### Company-Daten speichern

```text
PUT /api/company-setup/company
```

Body:

```text
CompanySetupCompanyDTO
```

---

### Owner speichern

```text
PUT /api/company-setup/owner
```

Body:

```text
EmployeeCreateDTO
```

Regel:

Erstellt oder aktualisiert den Owner-Employee.

---

### Öffnungszeiten speichern

```text
PUT /api/company-setup/opening-hours
```

Body:

```text
OpeningHoursUpdateDTO
```

---

### Rolle erstellen

```text
POST /api/company-setup/roles
```

Body:

```text
RoleCreateDTO
```

---

### Rolle ändern

```text
PUT /api/company-setup/roles/{roleId}
```

---

### Rolle löschen

```text
DELETE /api/company-setup/roles/{roleId}
```

Nur Rollen der Setup-Company dürfen gelöscht werden.

---

### Schichtvorlage erstellen

```text
POST /api/company-setup/shift-templates
```

Body:

```text
ShiftTemplateCreateDTO
```

---

### Schichtvorlage ändern

```text
PUT /api/company-setup/shift-templates/{shiftTemplateId}
```

---

### Schichtvorlage löschen

```text
DELETE /api/company-setup/shift-templates/{shiftTemplateId}
```

---

### Mitarbeiter erstellen

```text
POST /api/company-setup/employees
```

Body:

```text
EmployeeCreateDTO
```

---

### Mitarbeiter ändern

```text
PUT /api/company-setup/employees/{employeeId}
```

---

### Mitarbeiter löschen

```text
DELETE /api/company-setup/employees/{employeeId}
```

Der Owner darf nicht versehentlich gelöscht werden.

---

### Rechtliche Bestätigung speichern

```text
PUT /api/company-setup/legal-confirmation
```

Body:

```text
LegalConfirmationDTO
```

---

### Zusammenfassung laden

```text
GET /api/company-setup/summary
```

Gibt alle gespeicherten Setup-Daten zurück.

---

### Setup abschließen

```text
POST /api/company-setup/complete
```

Backend macht:

1. Company ist noch `SETUP`
2. Owner existiert
3. rechtliche Bestätigung existiert
4. Keycloak-User für Owner erstellen
5. Keycloak-Rolle `user-is-manager` setzen
6. Employee.keycloakId speichern
7. Company.ownerEmployee setzen
8. Company.status = ACTIVE
9. Invite.status = COMPLETED
10. Invite.completedAt setzen
11. Setup-Session deaktivieren
12. Keycloak sendet Passwort-Setzen-Mail

---

# 17. Services

## 17.1 CompanySetupInviteService

Aufgaben:

- Invite erstellen
- Token generieren
- Passwort generieren
- Passwort hashen
- Invite deaktivieren
- Invite logisch löschen
- Invite erneut senden

---

## 17.2 CompanySetupSessionService

Aufgaben:

- Passwort prüfen
- failedAttempts erhöhen
- Lock setzen
- Session erstellen
- Session prüfen
- Session deaktivieren

---

## 17.3 CompanySetupService

Aufgaben:

- Company im Status `SETUP` erstellen
- Company-Daten speichern
- Owner speichern
- Öffnungszeiten speichern
- rechtliche Bestätigung speichern
- Setup abschließen
- Summary laden

---

## 17.4 MailService

Aufgaben:

- Setup-Einladung senden
- Setup-Link und Setup-Passwort in E-Mail einfügen

Empfohlener Anbieter:

```text
Brevo
```

Begründung:

- kostenloser Plan reicht für Setup-E-Mails
- höheres kostenloses Tageslimit als Resend
- für transaktionale E-Mails geeignet

---

## 17.5 KeycloakAdminService

Aufgaben:

- Keycloak-User erstellen
- Rolle `user-is-manager` zuweisen
- Passwort-Setzen-Mail auslösen
- Keycloak-ID zurückgeben

---

# 18. Frontend-Komponenten

## 18.1 Public Setup

```text
CompanySetupPageComponent
SetupPasswordComponent
CompanySetupWizardComponent
SetupProgressBarComponent
SetupStepperComponent
```

---

## 18.2 Wizard Steps

```text
CompanyDataStepComponent
OwnerDataStepComponent
OpeningHoursStepComponent
RolesStepComponent
ShiftTemplatesStepComponent
EmployeesStepComponent
LegalConfirmationStepComponent
SetupSummaryStepComponent
```

---

## 18.3 Dialoge / Modals

```text
RoleFormDialogComponent
ShiftTemplateFormDialogComponent
EmployeeFormDialogComponent
```

---

## 18.4 Admin Layout

```text
AdminLayoutComponent
AdminCompaniesPageComponent
AdminCompanySetupInvitesPageComponent
AdminCreateSetupInviteDialogComponent
```

---

# 19. Admin-Tabellen

## 19.1 Company-Tabelle

Spalten:

```text
Firmenname
Status
Owner
Erstellt am
Erstellt von
Aktionen
```

Aktionen:

```text
Details ansehen
Bearbeiten
Deaktivieren
Owner anzeigen
```

---

## 19.2 Setup-Einladungen-Tabelle

Spalten:

```text
E-Mail
Vorläufiger Firmenname
Status
Erstellt am
Erstellt von
Company erstellt?
Aktionen
```

Aktionen:

```text
E-Mail erneut senden
Einladung deaktivieren
Einladung logisch löschen
```

---

# 20. Reihenfolge der Umsetzung

## Schritt 1: Enums erstellen

- `CompanyStatus`
- `CompanySetupInviteStatus`

---

## Schritt 2: Company erweitern

- neue Felder hinzufügen
- `status`
- `ownerEmployee`

---

## Schritt 3: Setup-Entities erstellen

- `CompanySetupInvite`
- `CompanySetupSession`
- `CompanyOpeningHour`
- `CompanyLegalConfirmation`

---

## Schritt 4: ShiftTemplate prüfen/erweitern

- `ShiftTemplate`
- `ShiftTemplateRole`
- Feld `count`

---

## Schritt 5: DTOs erstellen

- `CompanySetupInviteCreateDTO`
- `CompanySetupLoginDTO`
- `CompanySetupSessionDTO`
- `CompanySetupCompanyDTO`
- `OpeningHourCreateDTO`
- `OpeningHoursUpdateDTO`
- `LegalConfirmationDTO`

Bestehende DTOs weiterverwenden:

- `EmployeeCreateDTO`
- `RoleCreateDTO`
- `ShiftTemplateCreateDTO`
- `TemplateRoleCreateDTO`

---

## Schritt 6: Admin-Endpunkte bauen

- Invite erstellen
- Invite anzeigen
- Invite erneut senden
- Invite deaktivieren
- Invite logisch löschen
- Company-Übersicht

---

## Schritt 7: Setup-Login bauen

- Token prüfen
- Passwort prüfen
- Company mit `SETUP` erstellen
- Session mit 3 Stunden Ablauf erstellen

---

## Schritt 8: Setup-Session-Prüfung zentral bauen

Z. B. als Service-Methode:

```java
Company getSetupCompanyFromSession(String setupSessionToken)
```

Diese Methode prüft immer:

- Session gültig
- nicht abgelaufen
- Invite gültig
- Company SETUP

---

## Schritt 9: Setup-Schritte backendseitig bauen

- Company-Daten
- Owner
- Öffnungszeiten
- Rollen
- Schichtvorlagen
- Mitarbeiter
- Rechtliches
- Summary
- Complete

---

## Schritt 10: Keycloak-Abschluss bauen

Beim Complete-Endpunkt:

- Keycloak-User erstellen
- Rolle setzen
- Passwort-Mail auslösen
- Company aktivieren

---

## Schritt 11: MailService bauen

Empfehlung:

- zuerst Interface definieren
- Implementierung mit Brevo
- später austauschbar halten

Beispiel-Struktur:

```java
public interface MailService {
    void sendCompanySetupInvite(String recipientEmail, String setupLink, String setupPassword);
}
```

---

## Schritt 12: Frontend Public Setup bauen

- Route `/company-setup/:token`
- Passwortseite
- Session speichern
- Wizard starten
- Progress Bar
- Stepper

---

## Schritt 13: Wizard-Schritte bauen

- Unternehmensdaten
- Ownerdaten
- Öffnungszeiten
- Rollen
- Schichtvorlagen
- Mitarbeiter
- Rechtliches
- Zusammenfassung

---

## Schritt 14: Admin Layout bauen

- Admin-Routing
- Admin-Guard für `user-is-internal-admin`
- Company-Tabelle
- Setup-Invite-Tabelle
- Create-Invite-Dialog
- Resend/Disable/Delete-Aktionen

---

# 21. Wichtige Regeln

## 21.1 Keine öffentlichen normalen Company-Endpunkte

Die normale Company-Erstellung bleibt geschützt.

Das Setup verwendet eigene Endpunkte.

---

## 21.2 Keine Company-ID vom Frontend vertrauen

Die Company wird immer über die Setup-Session bestimmt.

---

## 21.3 Keine echte Zwischenspeicherung

Das Setup muss in einem Durchgang abgeschlossen werden.

Technisch werden Daten trotzdem direkt gespeichert, weil Rollen, Schichtvorlagen und Mitarbeiter sofort eine Company-ID brauchen.

Unfertige Company bleibt:

```text
status = SETUP
```

---

## 21.4 Deaktivieren statt löschen

Einladungen und Companies werden nicht hart gelöscht.

Löschen bedeutet:

```text
Invite.status = DELETED
Company.status = DISABLED
```

---

## 21.5 Setup-Company nicht in normaler App anzeigen

Private App soll nur Companies mit folgendem Status anzeigen:

```text
ACTIVE
```

---

# 22. Ergebnis

Nach Umsetzung gibt es einen sauberen Onboarding-Prozess:

```text
Interner Admin erstellt Einladung
↓
Kunde bekommt Link + Passwort
↓
Kunde gibt Passwort ein
↓
Company wird als SETUP erstellt
↓
Kunde füllt Wizard aus
↓
Kunde schließt Setup ab
↓
Owner wird Employee
↓
Owner wird Company-Owner
↓
Keycloak-User wird erstellt
↓
Company wird ACTIVE
↓
Manager kann sich einloggen
```