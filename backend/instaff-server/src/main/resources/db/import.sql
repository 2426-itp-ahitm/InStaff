/*COMPANY*/
insert into company (companyName)
values ('Stoaboch Wirt');

/*MANAGER*/
insert into manager (birthdate, email, firstname, lastname, telephone, company_id)
values ('2000-11-20 00:00:00', 'bernhard@penkner.com', 'Bernhard', 'Penkner', '+43677238384878', 1);

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
insert into employee (birthdate, email, firstname, lastname, telephone, company_id, is_manager, address, hourly_wage)
values ('2004-11-11 00:00:00', 'p.pfarrhofer@students.htl-leonding.ac.at', 'john', 'doe', '1233456899', 1, false, 'Limesstraße 12, 4060 Leonding', 10);
insert into employee (birthdate, email, firstname, lastname, telephone, company_id, is_manager, address, hourly_wage)
values ('2001-11-09 00:00:00', 'alexander.hahn1@outlook.de', 'Alexander', 'Hahn', '65626625', 1, false, 'Limesstraße 12, 4060 Leonding', 20);

/*SHIFT*/
insert into Shift (starttime, endtime, company_id)
values ('2025-06-20 09:00:00', '2025-06-20 17:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2025-06-25 17:00:00', '2025-06-25 20:00:00', 1);

/*ASSOCIATIVE*/
insert into employee_role (employee_id, role_id)
values (1, 1);
insert into employee_role (employee_id, role_id)
values (1, 3);
insert into employee_role (employee_id, role_id)
values (2, 2);
insert into employee_role (employee_id, role_id)
values (2, 3);
insert into employee_role (employee_id, role_id)
values (3, 3);
insert into employee_role (employee_id, role_id)
values (3, 4);

insert into assignment (employee_id, shift_id, role_id)
values(1, 1, 1);
insert into assignment (employee_id, shift_id, role_id)
values (1, 2, 1);

/* Neue Manager */
insert into employee (birthdate, email, firstname, lastname, telephone, company_id, is_manager, address, hourly_wage)
values ('1975-02-27 00:00:00', 'bernhard@penkner.com', 'Bernhard', 'Penkner', '67734144524', 1, true, 'Limesstraße 12, 4060 Leonding', 10);

/* Neue Mitarbeiter */
insert into employee (birthdate, email, firstname, lastname, telephone, company_id, is_manager, address, hourly_wage)
values ('1995-03-22 00:00:00', 'michael.brown@example.com', 'Michael', 'Brown', '5551234567', 1, false, 'Limesstraße 12, 4060 Leonding', 10);
insert into employee (birthdate, email, firstname, lastname, telephone, company_id, is_manager, address, hourly_wage)
values ('1992-08-17 00:00:00', 'sarah.jones@example.com', 'Sarah', 'Jones', '4441239876', 1, false, 'Limesstraße 12, 4060 Leonding', 10);
insert into employee (birthdate, email, firstname, lastname, telephone, company_id, is_manager, address, hourly_wage)
values ('1988-12-01 00:00:00', 'daniel.white@example.com', 'Daniel', 'White', '6669876543', 1, false, 'Limesstraße 12, 4060 Leonding', 10);

/* Neue Schichten */
insert into Shift (starttime, endtime, company_id)
values ('2026-03-26 08:00:00', '2026-03-26 16:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2026-03-27 14:00:00', '2026-03-27 22:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2026-03-28 10:00:00', '2026-03-28 18:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2026-06-14 09:00:00', '2026-06-14 17:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2026-06-15 11:00:00', '2026-06-15 19:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2026-06-18 08:00:00', '2026-06-18 16:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2026-06-20 12:00:00', '2026-06-20 20:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2026-06-22 10:00:00', '2026-06-22 18:00:00', 1);
insert into Shift (starttime, endtime, company_id)
values ('2026-06-15 20:00:00', '2026-06-15 21:00:00', 1);

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
insert into assignment (employee_id, shift_id, role_id)
values (2, 9, 2); -- Alexander Hahn arbeitet in Schicht 9

-- Weitere Mitarbeiter für Schicht 5 (shift_id = 5)
insert into assignment (employee_id, shift_id, role_id) values (4, 5, 3);
insert into assignment (employee_id, shift_id, role_id) values (5, 5, 3);
insert into assignment (employee_id, shift_id, role_id) values (6, 5, 3);

insert into assignment (employee_id, shift_id, role_id) values (1, 5, 1);
insert into assignment (employee_id, shift_id, role_id) values (2, 5, 3);
insert into assignment (employee_id, shift_id, role_id) values (3, 5, 3);

-- Weitere Mitarbeiter für Schicht 6 (shift_id = 6)
insert into assignment (employee_id, shift_id, role_id) values (4, 6, 3);
insert into assignment (employee_id, shift_id, role_id) values (5, 6, 3);
insert into assignment (employee_id, shift_id, role_id) values (6, 6, 3);

insert into assignment (employee_id, shift_id, role_id) values (1, 6, 1);
insert into assignment (employee_id, shift_id, role_id) values (2, 6, 3);
insert into assignment (employee_id, shift_id, role_id) values (3, 6, 3);

-- Weitere Mitarbeiter für Schicht 7 (shift_id = 7)
insert into assignment (employee_id, shift_id, role_id) values (4, 7, 3);
insert into assignment (employee_id, shift_id, role_id) values (5, 7, 3);
insert into assignment (employee_id, shift_id, role_id) values (6, 7, 3);

insert into assignment (employee_id, shift_id, role_id) values (1, 7, 1);
insert into assignment (employee_id, shift_id, role_id) values (2, 7, 3);
insert into assignment (employee_id, shift_id, role_id) values (3, 7, 3);

-- Weitere Mitarbeiter für Schicht 8 (shift_id = 8)
insert into assignment (employee_id, shift_id, role_id) values (4, 8, 3);
insert into assignment (employee_id, shift_id, role_id) values (5, 8, 3);
insert into assignment (employee_id, shift_id, role_id) values (6, 8, 3);

insert into assignment (employee_id, shift_id, role_id) values (1, 8, 1);
insert into assignment (employee_id, shift_id, role_id) values (2, 8, 2);
insert into assignment (employee_id, shift_id, role_id) values (3, 8, 3);

/* Reservierungen */
insert into reservation (name, infos, numberofpeople, starttime, endtime, shift_id)
values ('Geburtstag Loisi', 'Die Loisi feiert ihren 60er.', 120, '13:00:00', '17:00:00', 1);
insert into reservation (name, infos, numberofpeople, starttime, endtime, shift_id)
values ('Reservierung Riener', '', 4, '12:00:00', '13:30:00', 1);

/* Shift Templates*/
insert into shift_template (shift_template_name, company_id)
values ('Sonntags Schicht', 1);
insert into shift_template (shift_template_name, company_id)
values ('Mittags Schicht', 1);
insert into shift_template (shift_template_name, company_id)
values ('Abend Schicht', 1);

/* Template Roles */
insert into template_role (role_id, shift_template_id, count)
values (1, 1, 3);
insert into template_role (role_id, shift_template_id, count)
values (2, 1, 1);
insert into template_role (role_id, shift_template_id, count)
values (3, 1, 2);

insert into template_role (role_id, shift_template_id, count)
values (1, 2, 1);
insert into template_role (role_id, shift_template_id, count)
values (2, 2, 2);
insert into template_role (role_id, shift_template_id, count)
values (3, 2, 1);

insert into template_role (role_id, shift_template_id, count)
values (1, 3, 3);
insert into template_role (role_id, shift_template_id, count)
values (2, 3, 3);
insert into template_role (role_id, shift_template_id, count)
values (3, 3, 2);