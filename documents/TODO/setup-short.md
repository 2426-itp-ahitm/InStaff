# InStaff Company Setup – Kurzfassung für das Team

## Ziel

Neue Kunden sollen ihre Firma selbst über einen Setup-Link einrichten können.

Eine interne berechtigte Person erstellt eine Einladung. Der Kunde bekommt per E-Mail einen Link und ein Setup-Passwort. Nach Eingabe des Passworts wird eine Company im Status `SETUP` erstellt. Danach füllt der Kunde einen Wizard aus. Am Ende wird die Company aktiviert und der erste Manager bekommt einen Keycloak-Zugang.

---

# Flow

```text
Interner Admin erstellt Setup-Einladung
↓
Kunde bekommt E-Mail mit Link + Passwort
↓
Kunde öffnet Link
↓
Kunde gibt Passwort ein
↓
Backend erstellt Company mit status = SETUP
↓
Setup-Session wird für 3 Stunden erstellt
↓
Kunde füllt Wizard aus
↓
Company wird abgeschlossen
↓
Owner-Employee wird erstellt
↓
Keycloak-User wird erstellt
↓
Keycloak sendet Passwort-Mail
↓
Company.status = ACTIVE
↓
Manager kann sich einloggen
```

---

# Admin-Bereich

Es wird ein eigenes Admin-Layout geben.

Keycloak-Rolle:

```text
user-is-internal-admin
```

Admin-Seiten:

```text
1. Company-Übersicht
2. Setup-Einladungen / Company Create Requests
```

In der Setup-Einladungsseite kann man:

```text
- neue Einladung erstellen
- E-Mail erneut senden
- Einladung deaktivieren
- Einladung logisch löschen
```

Löschen bedeutet nicht wirklich löschen, sondern Status setzen.

---

# Setup-Einladung

Beim Erstellen gibt der interne Admin ein:

```text
- E-Mail-Adresse
- vorläufiger Firmenname
```

Das System generiert:

```text
- Setup-Link
- Setup-Passwort
```

Beides wird in derselben E-Mail gesendet.

Der Link hat kein Ablaufdatum.

Die Setup-Session nach Passworteingabe läuft aber nach 3 Stunden ab.

---

# Sicherheit

Normale Company-Endpunkte bleiben Keycloak-geschützt.

Es wird keine öffentliche normale Company-POST-Funktion geben.

Für das Setup gibt es eigene Endpunkte.

Diese prüfen:

```text
- Setup-Token
- Setup-Passwort
- Setup-Session
- Company.status = SETUP
```

Die Company-ID wird nicht aus dem Frontend übernommen. Das Backend ermittelt die Company immer über die Setup-Session.

---

# Wizard

Nach der Passwortseite kommt ein Wizard mit:

```text
- Stepper oben
- Progress Bar
```

Schritte:

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

Pflicht:

```text
- Unternehmensdaten
- Managerdaten / Owner
- Öffnungszeiten
- Rechtliches
- Zusammenfassung / Abschluss
```

Optional und überspringbar:

```text
- Rollen
- Schichtvorlagen
- weitere Mitarbeiter
```

Übersprungene Schritte werden in der Zusammenfassung angezeigt:

```text
Rollen: nicht eingerichtet
Kann später im System nachgeholt werden.
```

---

# Company-Daten

Die Company bekommt unter anderem:

```text
- Firmenname
- Branche
- UID-Nummer
- öffentliche Telefonnummer
- öffentliche E-Mail
- Adresse
- Standortname
- Hauptansprechpartner Name
- Hauptansprechpartner E-Mail
- Hauptansprechpartner Telefonnummer
- Status
- Owner-Employee
```

Status:

```text
SETUP
ACTIVE
DISABLED
```

---

# Owner

Der erste Manager wird als normaler Employee angelegt.

Danach wird er als Owner in der Company gespeichert:

```text
Company.ownerEmployee = erster Manager
```

Beim Setup-Abschluss wird für diesen Employee ein Keycloak-User erstellt.

Keycloak-Rolle:

```text
user-is-manager
```

Die E-Mail dieses Employees ist die spätere Login-E-Mail.

---

# Öffnungszeiten

Für jeden Wochentag wird angegeben:

```text
geschlossen
oder
Startzeit + Endzeit
```

Sonderregeln wie „letzter Sonntag im Monat geschlossen“ kommen später ins normale System, nicht ins Setup.

---

# Rollen

DTO:

```java
public record RoleCreateDTO(
        String roleName,
        String description
) {
}
```

Rollen sind optional und können im Setup übersprungen werden.

---

# Schichtvorlagen

DTO:

```java
public record ShiftTemplateCreateDTO(
        String shiftTemplateName,
        List<TemplateRoleCreateDTO> templateRoles
) {
}
```

```java
public record TemplateRoleCreateDTO(
        long roleId,
        int count
) {
}
```

Beispiel:

```text
Abendbetrieb:
- Kellner 3x
- Küche 1x
- Bar 1x
```

Damit kann man später beim Erstellen einer Schicht schneller die benötigten Rollen übernehmen.

---

# Mitarbeiter

Es wird der bestehende `EmployeeCreateDTO` verwendet.

Der erste Manager ist Pflicht.

Weitere Mitarbeiter sind optional.

---

# Mailanbieter

Empfehlung:

```text
Brevo
```

Grund:

```text
- kostenlos nutzbar
- mehr kostenlose E-Mails pro Tag als Resend
- passend für Setup-Einladungen
```

Keycloak sendet die Passwort-Mail selbst.

InStaff muss nur die Setup-Einladung senden.

---

# Wichtigste technische Regel

Das Setup verwendet eigene Endpunkte und eigene Setup-Sicherheit.

```text
Normales System: Keycloak-Login
Setup-System: Setup-Token + Passwort + Setup-Session
```

Dadurch bleibt die normale App sicher, obwohl der Kunde vor dem ersten Login schon Daten anlegen kann.