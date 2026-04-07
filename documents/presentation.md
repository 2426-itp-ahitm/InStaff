# Slide 1 – Instaff Logo – Tobi
Dear audience, dear jury,
we warmly welcome you to the presentation of our ITP project, Instaff.
And since we don't want to keep you in suspense for too long, let's dive right into the problem that a friend of ours — a restaurant owner — brought to our attention about a year and a half ago.

# Slide 2 – Problem – Tobi
What you see here are two young men who occasionally pick up a side job on weekends to supplement their income. They work as waiters, bartenders, or kitchen assistants in the hospitality industry, and for the most part, they enjoy the work. However, there is one significant issue that regularly takes the fun out of it — and that's the organization.

# Slide 3 – Problem – Tobi
In this establishment, every shift is planned entirely on paper, and information is not shared through a single, unified channel — instead, it's scattered across WhatsApp, Facebook, Instagram, Signal, and phone calls. This makes it nearly impossible to keep track of everything, and when the notebook containing the entire schedule goes missing, things quickly spiral into chaos. A digital solution could easily prevent all of this.

#   Slide 4 – Solution – Tobi
And that's exactly the digital solution we've built — with the goal of providing a simple, intuitive application for managing shifts, both for employees and employers.
And since an app speaks louder than a thousand words, let's jump straight into the demo.

# Slide 5 - Demo - Ali
 -- runter scrollen
 -- login als alois.ernst@instaff.at
 -- rollen hinzufügen: BBQ
 -- schicht vorlage hinzufügen: Grillhendl Dienstag, 1x BBQ, 1x Kellner
 -- MA Rolle geben: Paul Müller +BBQ
 -- Schicht erstellen nächsten Dienstag:
    -- Vorlage: Grillhendl Dienstag
    -- BBQ: Paul Müller
    -- Kellner: Anna Schmid
    -- + Spülkraft: Sarah Jones

-- 2. Fenster Login: paul.mueller@instaff.at
-- Schicht annehmen

-- 1. Fenster: Websocket

-- Zurück in Präsi



Now we are in the live demo of Instaff.

At the beginning, you can see our landing page.
This page gives a quick first impression of the platform and shows the main idea behind our project: making shift planning simple, digital, and easy to understand for everyone involved.

Next, we log in as the manager, because this is where the planning process usually starts.

From the manager side, the main goal is to prepare the next working day as fast as possible while still making sure that every role is filled with the right employee.

First, we add the new role BBQ.
This is a good example of how flexible our system is.
If there is a special event, a seasonal menu, or a new task in the restaurant, the manager can easily create a fitting role without changing any existing workflows.

After that, we create a shift template called Grilled Chicken Tuesday.
Templates are very important for daily business, because many shifts repeat every week.
Instead of creating the same setup again and again, the manager can simply reuse an existing template and save valuable time.

Now we assign Paul Müller the BBQ role.
This ensures that only employees with the right qualification or responsibility can be selected later in the shift.

In the next step, we create the shift for next Tuesday based on this template.
Here you can already see how fast the whole planning becomes.
With only a few clicks, the manager can prepare a complete shift with all required roles and staff members.

In our second window, Paul is already logged in as an employee.
We prepared this in advance so that we can focus directly on the most important part of the workflow.

As soon as the shift is created, Paul immediately receives the request.
He can review it and accept it with just one click.

And this brings us to one of our strongest features: real-time updates.
The manager instantly sees the confirmation through our WebSocket connection.

This removes the need for phone calls, messages, or checking multiple apps.
Everything happens in one central platform and in real time.

The result is a planning process that is faster, clearer, and much more reliable for both the manager and the employees.

# Slide 6 – Mobile Apps – Ali
— iOS & Android side by side —
Since usability is one of our top priorities, we want to give you a quick look at the employee experience on both platforms.
On the left, you can see the iOS version, and on the right, the Android version.
Even though both systems follow their own design language, the workflow stays consistent, so employees can immediately find their shifts, accept or decline requests, and manage their profile without any learning effort.

# Slide 7 – Practical Application – Phiz
And to show you how this all works in practice, let's bring in our three little helpers.

# Slide 8 – Team – Phiz
And since you're probably curious about who's standing in front of you, we'd like to take a moment to introduce ourselves:
Tobias Klement is our Project Manager, primarily responsible for the web app and the overall design.
Alexander Hahn is our Mobile Developer, as well as co-developer for Keycloak and the web app.
And my name is Philip Pfarrhofer — I'm responsible for the backend and deployment, and also work with Keycloak.

# Slide 9 – Tech Stack – Phiz
Our frontend is built with Angular and Tailwind as our CSS library. The Android app is developed in Java and XML, and the iOS app in Swift. Authentication is handled via Keycloak, and our backend runs on Quarkus with a PostgreSQL database. The entire application is deployed using Kubernetes and Docker.

# Slide 9 – Vision – Phiz
And because there's always room to grow, we'd like to share our vision with you. First and foremost, our goal is to make both employees and managers happy. Beyond that, we already have two hospitality businesses — a traditional restaurant and a ski lodge — that are planning their future with our software. We also aim to simplify shift scheduling through a dedicated AI, introduce automation for shift cancellations, and give employees the ability to proactively sign up for open shifts.

# Slide 10 – Questions? – Phiz
With that, we'd like to thank you for your attention — and we're happy to take any questions you may have.Sonnet 4.6Claude ist eine KI und kann Fehler machen. Bitte überprüfe die Antworten.
    
