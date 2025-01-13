/*COMPANY*/
insert into company (companyName)
values ('Stoaboch Wirt');
/*MANAGER*/
insert into manager (birthdate, email, firstname, lastname, password, telephone, company_id)
values ('2000-11-20 00:00:00', 'bernhard@penkner.com', 'Bernhard', 'Penkner', 'passwort', '+43677238384878', 1);
/*ROLE*/
insert into role (roleName, company_id)
values ('Koch', 1);
insert into role (roleName, company_id)
values ('Kellner', 1);
/*EMPLOYEE*/
insert into employee (birthdate, email, firstname, lastname, password, telephone, company_id)
values ('2004-11-11 00:00:00', 'john.doe@example.com', 'john', 'doe', 'hunter2', '1233456899', 1);
insert into employee (birthdate, email, firstname, lastname, password, telephone, company_id)
values ('2001-11-09 00:00:00', 'alexander.hahn@example.com', 'Alexander', 'Hahn', 'hunter34', '65626625', 1);
/*SHIFT*/
insert into Shift (starttime, endtime, company_id)
values ('2024-11-11 09:00:00', '2024-11-18 17:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2024-11-11 17:00:00', '2024-11-11 20:00:00', 1);

/*ASSOTIATIVE*/
insert into employee_role (employee_id, role_id)
values (1, 1);
insert into employee_role (employee_id, role_id)
values (1, 2);
insert into employee_role (employee_id, role_id)
values (2, 2);

insert into assignment (employee_id, shift_id, role_id)
values(1, 1, 1);

insert into assignment (employee_id, shift_id, role_id)
values (1, 2, 1);

/* Neue Mitarbeiter */
insert into employee (birthdate, email, firstname, lastname, password, telephone, company_id)
values ('1995-03-22 00:00:00', 'michael.brown@example.com', 'Michael', 'Brown', 'securepass2', '5551234567', 1);
insert into employee (birthdate, email, firstname, lastname, password, telephone, company_id)
values ('1992-08-17 00:00:00', 'sarah.jones@example.com', 'Sarah', 'Jones', 'securepass3', '4441239876', 1);
insert into employee (birthdate, email, firstname, lastname, password, telephone, company_id)
values ('1988-12-01 00:00:00', 'daniel.white@example.com', 'Daniel', 'White', 'securepass4', '6669876543', 1);

/* Neue Schichten */
insert into Shift (starttime, endtime, company_id)
values ('2024-11-19 08:00:00', '2024-11-19 16:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2024-11-20 14:00:00', '2024-11-20 22:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2024-11-21 10:00:00', '2024-11-21 18:00:00', 1);

/* Rollen für die neuen Mitarbeiter */
insert into employee_role (employee_id, role_id)
values (3, 1); -- Michael Brown als Koch
insert into employee_role (employee_id, role_id)
values (4, 2); -- Sarah Jones als Kellnerin
insert into employee_role (employee_id, role_id)
values (5, 1); -- Daniel White als Koch

/* Mitarbeiter-Schicht-Zuordnungen */
insert into assignment (employee_id, shift_id, role_id)
values (3, 3, 1); -- Michael Brown arbeitet in Schicht 3
insert into assignment (employee_id, shift_id, role_id)
values (3, 4, 1); -- Michael Brown arbeitet in Schicht 4
insert into assignment (employee_id, shift_id, role_id)
values (4, 4, 1); -- Sarah Jones arbeitet in Schicht 4
insert into assignment (employee_id, shift_id, role_id)
values (4, 5, 2); -- Sarah Jones arbeitet in Schicht 5
insert into assignment (employee_id, shift_id, role_id)
values (5, 5, 2); -- Daniel White arbeitet in Schicht 5
insert into assignment (employee_id, shift_id, role_id)
values (2, 3, 2); -- Alexander Hahn arbeitet in Schicht 3
insert into assignment (employee_id, shift_id, role_id)
values (2, 5, 2); -- Alexander Hahn arbeitet in Schicht 5
