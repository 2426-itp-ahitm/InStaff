/* COMPANY */
insert into company (id, company_name)
values
    (1, 'Leondinger Wirt');

/* ROLE */
insert into role (id, role_name, description, company_id)
values
    (1, 'Koch', 'Ist verantwortlich für die Küche und kocht das Essen', 1),
    (2, 'Küchenhilfe', 'Unterstützt den Koch in der Küche', 1),
    (3, 'Kellner', 'Ist für den Service der Gäste verantwortlich', 1),
    (4, 'Barkeeper', 'Serviert (anti-)alkoholische Getränke an der Bar', 1),
    (5, 'Spülkraft', 'Reinigt und sortiert das Geschirr', 1);

/* EMPLOYEE */
insert into employee (id, birthdate, email, firstname, lastname, telephone, company_id, is_manager, address, hourly_wage, is_active, is_self_managed)
values
    (1, '2004-11-11 00:00:00', 'paul.mueller@instaff.at', 'Paul', 'Müller', '+436641234567', 1, false, 'Limesstraße 12, 4060 Leonding', 15, true, true),
    (2, '2003-04-21 00:00:00', 'alexander.hahn@instaff.at', 'Alexander', 'Hahn', '+436601112233', 1, false, 'Stadtplatz 4, 4020 Linz', 16, true, true),
    (3, '1998-06-15 00:00:00', 'grandma.schmid@instaff.at', 'Grandma', 'Schmid', '+436763334455', 1, false, 'Unionstraße 18, 4020 Linz', 17, true, false),
    (4, '1985-02-27 00:00:00', 'bernhard.penkner@instaff.at', 'Bernhard', 'Penkner', '+436991234567', 1, true, 'Limesstraße 30, 4060 Leonding', 22, true, true),
    (5, '1995-03-22 00:00:00', 'michael.brown@instaff.at', 'Michael', 'Brown', '+436504445566', 1, false, 'Hauptstraße 7, 4050 Traun', 15, true, true),
    (6, '1992-08-17 00:00:00', 'sarah.jones@instaff.at', 'Sarah', 'Jones', '+436644443322', 1, false, 'Bahnhofstraße 11, 4020 Linz', 16, true, true),
    (7, '1988-12-01 00:00:00', 'daniel.white@instaff.at', 'Daniel', 'White', '+436801234890', 1, false, 'Marktplatz 2, 4061 Pasching', 18, true, true),
    (8, '1985-05-03 00:00:00', 'alois.ernst@instaff.at', 'Alois', 'Ernst', '+4306820235843', 1, true, 'Hofberg 18, 4020 Linz', 40, true, true);

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
    (11, 'Abend Schicht', '2026-03-20 20:00:00', '2026-03-20 23:00:00', 1),

    (12, 'Samstags Schicht', '2026-04-04 09:00:00', '2026-04-04 17:00:00', 1),
    (13, 'Sonntags Schicht', '2026-04-05 09:00:00', '2026-04-05 17:00:00', 1),

    (14, 'Wochentag', '2026-04-07 09:00:00', '2026-04-07 17:00:00', 1),
    (15, 'Wochentag', '2026-04-08 09:00:00', '2026-04-08 17:00:00', 1),
    (16, 'Wochentag', '2026-04-09 09:00:00', '2026-04-09 17:00:00', 1),
    (17, 'Wochentag', '2026-04-10 09:00:00', '2026-04-10 17:00:00', 1),

    (18, 'Samstags Schicht', '2026-04-11 09:00:00', '2026-04-11 17:00:00', 1),
    (19, 'Sonntags Schicht', '2026-04-12 09:00:00', '2026-04-12 17:00:00', 1),

    (20, 'Wochentag', '2026-04-14 09:00:00', '2026-04-14 17:00:00', 1),
    (21, 'Wochentag', '2026-04-15 09:00:00', '2026-04-15 17:00:00', 1),
    (22, 'Wochentag', '2026-04-16 09:00:00', '2026-04-16 17:00:00', 1),
    (23, 'Wochentag', '2026-04-17 09:00:00', '2026-04-17 17:00:00', 1),

    (24, 'Samstags Schicht', '2026-04-18 09:00:00', '2026-04-18 17:00:00', 1),
    (25, 'Sonntags Schicht', '2026-04-19 09:00:00', '2026-04-19 17:00:00', 1),

    (26, 'Wochentag', '2026-04-21 09:00:00', '2026-04-21 17:00:00', 1),
    (27, 'Wochentag', '2026-04-22 09:00:00', '2026-04-22 17:00:00', 1),
    (28, 'Wochentag', '2026-04-23 09:00:00', '2026-04-23 17:00:00', 1),
    (29, 'Wochentag', '2026-04-24 09:00:00', '2026-04-24 17:00:00', 1),

    (30, 'Samstags Schicht', '2026-04-25 09:00:00', '2026-04-25 17:00:00', 1),
    (31, 'Sonntags Schicht', '2026-04-26 09:00:00', '2026-04-26 17:00:00', 1),

    (32, 'Wochentag', '2026-04-28 09:00:00', '2026-04-28 17:00:00', 1),
    (33, 'Wochentag', '2026-04-29 09:00:00', '2026-04-29 17:00:00', 1),
    (34, 'Wochentag', '2026-04-30 09:00:00', '2026-04-30 17:00:00', 1);

/* EMPLOYEE_ROLE */
insert into employee_role (employee_id, role_id)
values
    (1,1),
    (1,2),
    (1,5),

    (2,3),
    (2,4),

    (3,3),
    (3,4),
    (3,5),

    (4,1),
    (4,3),
    (4,4),

    (5,1),
    (5,2),

    (6,3),
    (6,5),

    (7,3),
    (7,4),

    (8,1),
    (8,3),
    (8,4);

/* ASSIGNMENT */
insert into assignment (id, employee_id, shift_id, role_id, status, seen)
values
    (1, 1,1,1, 'PENDING', false),
    (2, 4,2,1, 'PENDING', false),
    (3, 1,5,1, 'PENDING', false),
    (4, 5,3,1, 'PENDING', false),
    (5, 4,4,1, 'PENDING', false),
    (6, 8,4,1, 'PENDING', false),
    (7, 5,5,2, 'PENDING', false),
    (8, 1,5,2, 'PENDING', false),
    (9, 2,3,3, 'PENDING', false),
    (10, 2,5,3, 'PENDING', false),
    (11, 7,9,3, 'PENDING', false),

    (12, 4,5,3, 'PENDING', false),
    (13, 6,5,3, 'PENDING', false),
    (14, 3,5,3, 'PENDING', false),
    (15, 8,5,1, 'PENDING', false),
    (16, 2,5,4, 'PENDING', false),
    (17, 7,5,4, 'PENDING', false),

    (18, 4,6,3, 'PENDING', false),
    (19, 6,6,3, 'PENDING', false),
    (20, 3,6,3, 'PENDING', false),
    (21, 1,6,1, 'PENDING', false),
    (22, 2,6,4, 'PENDING', false),
    (23, 7,6,4, 'PENDING', false),

    (24, 4,7,3, 'PENDING', false),
    (25, 6,7,3, 'PENDING', false),
    (26, 3,7,3, 'PENDING', false),
    (27, 5,7,1, 'PENDING', false),
    (28, 2,7,4, 'PENDING', false),
    (29, 7,7,4, 'PENDING', false),

    (30, 8,8,3, 'PENDING', false),
    (31, 6,8,3, 'PENDING', false),
    (32, 3,8,3, 'PENDING', false),
    (33, 1,8,1, 'PENDING', false),
    (34, 2,8,4, 'PENDING', false),
    (35, 7,8,4, 'PENDING', false),
    -- repeat same realistic weekly rotation for 20–34
    (74, 1,20,1, 'PENDING', false),
    (75, 5,20,2, 'PENDING', false),
    (76, 2,20,3, 'PENDING', false),

    (77, 4,21,1, 'PENDING', false),
    (78, 1,21,2, 'PENDING', false),
    (79, 7,21,3, 'PENDING', false),
    (80, 8,22,1, 'PENDING', false),
    (81, 5,22,2, 'PENDING', false),
    (82, 3,22,3, 'PENDING', false),
    (83, 1,23,1, 'PENDING', false),
    (84, 5,23,2, 'PENDING', false),
    (85, 2,23,3, 'PENDING', false),

    (86, 4,24,1, 'PENDING', false),
    (87, 8,24,1, 'PENDING', false),
    (88, 1,24,2, 'PENDING', false),
    (89, 2,24,3, 'PENDING', false),
    (90, 3,24,3, 'PENDING', false),
    (91, 7,24,3, 'PENDING', false),
    (92, 6,24,5, 'PENDING', false),
    (93, 1,25,1, 'PENDING', false),
    (94, 4,25,1, 'PENDING', false),
    (95, 5,25,2, 'PENDING', false),
    (96, 2,25,3, 'PENDING', false),
    (97, 3,25,3, 'PENDING', false),
    (98, 6,25,5, 'PENDING', false),

    (99, 1,26,1, 'PENDING', false),
    (100, 5,26,2, 'PENDING', false),
    (101, 2,26,3, 'PENDING', false),
    (102, 4,27,1, 'PENDING', false),
    (103, 1,27,2, 'PENDING', false),
    (104, 7,27,3, 'PENDING', false),
    (105, 8,28,1, 'PENDING', false),
    (106, 5,28,2, 'PENDING', false),
    (107, 3,28,3, 'PENDING', false),
    (108, 1,29,1, 'PENDING', false),
    (109, 5,29,2, 'PENDING', false),
    (110, 2,29,3, 'PENDING', false),

    (111, 4,30,1, 'PENDING', false),
    (112, 8,30,1, 'PENDING', false),
    (113, 1,30,2, 'PENDING', false),
    (114, 2,30,3, 'PENDING', false),
    (115, 3,30,3, 'PENDING', false),
    (116, 7,30,3, 'PENDING', false),
    (117, 6,30,5, 'PENDING', false),
    (118, 1,31,1, 'PENDING', false),
    (119, 4,31,1, 'PENDING', false),
    (120, 5,31,2, 'PENDING', false),
    (121, 2,31,3, 'PENDING', false),
    (122, 3,31,3, 'PENDING', false),
    (123, 6,31,5, 'PENDING', false),

    (124, 1,32,1, 'PENDING', false),
    (125, 5,32,2, 'PENDING', false),
    (126, 2,32,3, 'PENDING', false),
    (127, 4,33,1, 'PENDING', false),
    (128, 1,33,2, 'PENDING', false),
    (129, 7,33,3, 'PENDING', false),
    (130, 8,34,1, 'PENDING', false),
    (131, 5,34,2, 'PENDING', false),
    (132, 3,34,3, 'PENDING', false);

/* SHIFT TEMPLATE */
insert into shift_template (id, shift_template_name, company_id)
values
    (1, 'Sonntags Schicht', 1),
    (2, 'Samstags Schicht', 1),
    (3, 'Abend Schicht', 1),
    (4, 'Wochentag', 1);


/* TEMPLATE ROLE */
insert into template_role (id, role_id, shift_template_id, count)
values
    -- Sonntags Schicht (high guest load, no bar focus)
    (1,1,1,2), -- Koch
    (2,2,1,1), -- Küchenhilfe
    (3,3,1,2), -- Kellner
    (4,5,1,1), -- Spülkraft

    -- Samstags Schicht (highest guest load)
    (5,1,2,2),
    (6,2,2,1),
    (7,3,2,3),
    (8,5,2,1),

    -- Abend Schicht (small focused team)
    (9,1,3,1),
    (10,3,3,1),
    (11,4,3,1),

    -- Wochentag (lower traffic)
    (12,1,4,1),
    (13,2,4,1),
    (14,3,4,1);

/* SEQUENCES */
alter sequence company_seq restart with 2;
alter sequence role_seq restart with 6;
alter sequence employee_seq restart with 9;
alter sequence shift_seq restart with 35;
alter sequence shift_template_seq restart with 5;
alter sequence assignment_seq restart with 133;
alter sequence template_role_seq restart with 15;
