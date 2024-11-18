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
insert into employee_role (employee_id, roles_id)
values (3, 1); -- Michael Brown als Koch
insert into employee_role (employee_id, roles_id)
values (4, 2); -- Sarah Jones als Kellnerin
insert into employee_role (employee_id, roles_id)
values (5, 1); -- Daniel White als Koch

/* Mitarbeiter-Schicht-Zuordnungen */
insert into employeeshift (employee_id, shift_id)
values (3, 3); -- Michael Brown arbeitet in Schicht 3
insert into employeeshift (employee_id, shift_id)
values (3, 4); -- Michael Brown arbeitet in Schicht 4
insert into employeeshift (employee_id, shift_id)
values (4, 4); -- Sarah Jones arbeitet in Schicht 4
insert into employeeshift (employee_id, shift_id)
values (4, 5); -- Sarah Jones arbeitet in Schicht 5
insert into employeeshift (employee_id, shift_id)
values (5, 5); -- Daniel White arbeitet in Schicht 5
insert into employeeshift (employee_id, shift_id)
values (5, 6); -- Daniel White arbeitet in Schicht 6
insert into employeeshift (employee_id, shift_id)
values (1, 6); -- John Doe arbeitet in Schicht 6
insert into employeeshift (employee_id, shift_id)
values (2, 3); -- Alexander Hahn arbeitet in Schicht 3
insert into employeeshift (employee_id, shift_id)
values (2, 5); -- Alexander Hahn arbeitet in Schicht 5
