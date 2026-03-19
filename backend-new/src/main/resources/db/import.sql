/* COMPANY */
insert into company (id, company_name)
values
    (1, 'Stoaboch Wirt');

/* ROLE */
insert into role (id, role_name, description, company_id)
values
    (1, 'Koch', 'Ist verantwortlich für die Küche und kocht das Essen', 1),
    (2, 'Küchenhilfe', 'Unterstützt den Koch in der Küche', 1),
    (3, 'Kellner', 'Ist für den Service der Gäste verantwortlich', 1),
    (4, 'Barkeeper', 'Serviert (anti-)akoholische Getränke an der Bar', 1),
    (5, 'Spülkraft', 'Reinigt und sortiert das Geschirr', 1);

/* EMPLOYEE */
insert into employee (id, birthdate, email, firstname, lastname, telephone, company_id, is_manager, address, hourly_wage, is_active)
values
    (1, '2004-11-11 00:00:00', 'p.pfarrhofer@students.htl-leonding.ac.at', 'john', 'doe', '1233456899', 1, false, 'Limesstraße 12, 4060 Leonding', 10, true),
    (2, '2001-11-09 00:00:00', 'alexander.hahn1@outlook.de', 'Alexander', 'Hahn', '65626625', 1, false, 'Limesstraße 12, 4060 Leonding', 20, true),
    (3, '2006-11-11 00:00:00', 'o.ffen@students.htl-leonding.ac.at', 'offen', '', '1233456899', 1, false, 'Limesstraße 12, 4060 Leonding', 10, true),
    (4, '1975-02-27 00:00:00', 'bernhard@penkner.com', 'Bernhard', 'Penkner', '67734144524', 1, true, 'Limesstraße 12, 4060 Leonding', 10, true),
    (5, '1995-03-22 00:00:00', 'michael.brown@example.com', 'Michael', 'Brown', '5551234567', 1, false, 'Limesstraße 12, 4060 Leonding', 10, true),
    (6, '1992-08-17 00:00:00', 'sarah.jones@example.com', 'Sarah', 'Jones', '4441239876', 1, false, 'Limesstraße 12, 4060 Leonding', 10, true),
    (7, '1988-12-01 00:00:00', 'daniel.white@example.com', 'Daniel', 'White', '6669876543', 1, false, 'Limesstraße 12, 4060 Leonding', 10, true);

/* SHIFT */
insert into shift (id, shift_name, start_time, end_time, company_id)
values
    (1, 'Mittagsschicht', '2026-03-13 09:00:00', '2026-03-13 17:00:00', 1),
    (2, 'Abendschicht', '2026-03-13 18:00:00', '2026-03-13 20:00:00', 1),
    (3, 'Mittags Schicht', '2026-03-26 08:00:00', '2026-03-26 16:00:00', 1),
    (4, 'Abend Schicht', '2026-03-27 14:00:00', '2026-03-27 22:00:00', 1),
    (5, 'Mittags Schicht', '2026-03-28 10:00:00', '2026-03-28 18:00:00', 1),
    (6, 'Abend Schicht', '2026-03-14 09:00:00', '2026-03-14 17:00:00', 1),
    (7, 'Mittags Schicht', '2026-03-15 11:00:00', '2026-03-15 19:00:00', 1),
    (8, 'Abend Schicht', '2026-03-17 08:00:00', '2026-03-17 16:00:00', 1),
    (9, 'Nachmittags Schicht', '2026-03-18 12:00:00', '2026-03-18 20:00:00', 1),
    (10, 'Nachmittags Schicht', '2026-03-19 12:00:00', '2026-03-19 20:00:00', 1),
    (11, 'Abend Schicht', '2026-03-20 20:00:00', '2026-03-20 23:00:00', 1);

/* EMPLOYEE_ROLE */
insert into employee_role (employee_id, role_id)
values
    (1,1),
    (1,3),
    (2,2),
    (2,3),
    (3,3),
    (3,4),
    (3,1),
    (4,4),
    (5,3);

/* ASSIGNMENT */
insert into assignment (id, employee_id, shift_id, role_id, seen)
values
    (1, 1,1,1, false),
    (2, 1,2,1, false),
    (3, 1,5,1, false),
    (4, 3,3,1, false),
    (5, 3,4,1, false),
    (6, 4,4,1, false),
    (7, 4,5,2, false),
    (8, 5,5,2, false),
    (9, 2,3,2, false),
    (10, 2,5,2, false),
    (11, 2,9,2, false),

    (12, 4,5,3, false),
    (13, 5,5,3, false),
    (14, 6,5,3, false),
    (15, 1,5,1, false),
    (16, 2,5,3, false),
    (17, 3,5,3, false),

    (18, 4,6,3, false),
    (19, 5,6,3, false),
    (20, 6,6,3, false),
    (21, 1,6,1, false),
    (22, 2,6,3, false),
    (23, 3,6,3, false),

    (24, 4,7,3, false),
    (25, 5,7,3, false),
    (26, 6,7,3, false),
    (27, 1,7,1, false),
    (28, 2,7,3, false),
    (29, 3,7,3, false),

    (30, 4,8,3, false),
    (31, 5,8,3, false),
    (32, 6,8,3, false),
    (33, 1,8,1, false),
    (34, 2,8,2, false),
    (35, 3,8,3, false);

/* SHIFT TEMPLATE */
insert into shift_template (id, shift_template_name, company_id)
values
    (1, 'Sonntags Schicht', 1),
    (2, 'Mittags Schicht', 1),
    (3, 'Abend Schicht', 1);

/* TEMPLATE ROLE */
insert into template_role (id, role_id, shift_template_id, count)
values
    (1,1,1,3),
    (2,2,1,1),
    (3,3,1,2),
    (4,1,2,1),
    (5,2,2,2),
    (6,3,2,1),
    (7,1,3,3),
    (8,2,3,3),
    (9,3,3,2);

/* SEQUENCES */
alter sequence company_seq restart with 2;
alter sequence role_seq restart with 6;
alter sequence employee_seq restart with 8;
alter sequence shift_seq restart with 12;
alter sequence shift_template_seq restart with 4;
alter sequence assignment_seq restart with 36;
alter sequence template_role_seq restart with 10;