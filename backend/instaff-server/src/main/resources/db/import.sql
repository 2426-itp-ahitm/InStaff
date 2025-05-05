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
values ('Küchenhilfe', 1);
insert into role (roleName, company_id)
values ('Kellner', 1);
insert into role (roleName, company_id)
values ('Barkeeper', 1);
insert into role (roleName, company_id)
values ('Abwasch', 1);

/*EMPLOYEE*/
insert into employee (birthdate, email, firstname, lastname, password, telephone, company_id)
values ('2004-11-11 00:00:00', 'p.pfarrhofer@students.htl-leonding.ac.at', 'john', 'doe', 'f52fbd32b2b3b86ff88ef6c490628285f482af15ddcb29541f94bcf526a3f6c7', '1233456899', 1);
insert into employee (birthdate, email, firstname, lastname, password, telephone, company_id)
values ('2001-11-09 00:00:00', 'alexander.hahn@example.com', 'Alexander', 'Hahn', '63de5bde9699cf34c67bb8ea2c7f5e2418fbec929f37cef84f1b8f92ca5621fb', '65626625', 1);

/*SHIFT*/
insert into Shift (starttime, endtime, company_id)
values ('2025-03-25 09:00:00', '2025-03-25 17:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2025-03-25 17:00:00', '2025-03-25 20:00:00', 1);

/*ASSOCIATIVE*/
insert into employee_role (employee_id, role_id)
values (1, 1);
insert into employee_role (employee_id, role_id)
values (1, 3);
insert into employee_role (employee_id, role_id)
values (2, 2);

insert into assignment (employee_id, shift_id, role_id)
values(1, 1, 1);
insert into assignment (employee_id, shift_id, role_id)
values (1, 2, 1);

/* Neue Mitarbeiter */
insert into employee (birthdate, email, firstname, lastname, password, telephone, company_id)
values ('1995-03-22 00:00:00', 'michael.brown@example.com', 'Michael', 'Brown', 'ec9a7feb2fee607fcaa285bb4a7ab2d1f9d7e2ee81ef799a980085f011169798', '5551234567', 1);
insert into employee (birthdate, email, firstname, lastname, password, telephone, company_id)
values ('1992-08-17 00:00:00', 'sarah.jones@example.com', 'Sarah', 'Jones', '7e82e49658f51e4dbe373d3ff9772d7842e91d2d86bbe1502a039e4be3730517', '4441239876', 1);
insert into employee (birthdate, email, firstname, lastname, password, telephone, company_id)
values ('1988-12-01 00:00:00', 'daniel.white@example.com', 'Daniel', 'White', 'd499b8162341e1b8dc66cfd06a97b642a8db17fa7b171936a3a5f83eafb2a0db', '6669876543', 1);

/* Neue Schichten */
insert into Shift (starttime, endtime, company_id)
values ('2025-03-26 08:00:00', '2025-03-26 16:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2025-03-27 14:00:00', '2025-03-27 22:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2025-03-28 10:00:00', '2025-03-28 18:00:00', 1);

/* Rollen für die neuen Mitarbeiter */
insert into employee_role (employee_id, role_id)
values (3, 1); -- Michael Brown als Koch
insert into employee_role (employee_id, role_id)
values (4, 4); -- Sarah Jones als Kellnerin
insert into employee_role (employee_id, role_id)
values (5, 3); -- Daniel White als Koch

/* Mitarbeiter-Schicht-Zuordnungen */
insert into assignment (employee_id, shift_id, role_id)
values (1, 5, 1);
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

/* Reservierungen */
insert into reservation (name, infos, numberofpeople, starttime, endtime, shift_id)
values ('Geburtstag Loisi', 'Die Loisi feiert ihren 60er.', 120, '13:00:00', '17:00:00', 1);
insert into reservation (name, infos, numberofpeople, starttime, endtime, shift_id)
values ('Reservierung Riener', '', 4, '12:00:00', '13:30:00', 1);