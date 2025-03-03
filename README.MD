# InStaff


## The Staff Management System

## Team

* Klement Tobias
* Hahn Alexander
* Pfarrhofer Philip

## General

* Web Application
* Future plans: iOS and Android applications

## Initial Situation

Currently, managers in companies ask their employees via WhatsApp, Facebook, or Instagram whether they are available to work on specific days. Employees then respond whether they can work or not. This process is confusing and cumbersome for both managers and employees.

## Project Objectives

The application will provide the following functionality:

### For Managers:
* Create a new company
* Invite employees to their company
* Add new employees
* Manage and edit employee details
* Assign specific fields of activity to employees
* Notify employees of work opportunities (e.g., invite them to appointments)
* View employees in an organized way
* Create new appointments for employees

### For Employees:
* Join a company
* Receive notifications when the manager invites them to an appointment
* View all upcoming and previous appointments
* Sign up for or decline invitations to appointments

## Toolstack

### Frontend:
* Webpack
* HTML, CSS, JavaScript

### Backend:
* Quarkus Server
* Java

## Opportunities and Risks

### Opportunities:
* Large companies with many temporary employees can benefit greatly from using our application.

### Risks:
* Potential challenges with git merge conflicts during development.

# Development Using a Local Docker Compose Database

## Starting

```bash
./start.sh
```

## Deleting All Docker Containers, Images, and Volumes

```bash
./clean-docker.sh
```

## Backing Up the Database

```bash
docker exec -it postgres pg_dump -U demo > demo-backup.sql
```

## Stopping the Database

```bash
./down.sh
```
