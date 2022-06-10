ALTER TABLE "common_ticket" rename column "assignee" to "assignee_id";

ALTER TABLE "common_ticket" alter column assignee_id type integer USING assignee_id::integer;

ALTER TABLE "common_ticket" ADD  type_id integer;

INSERT INTO common_dictionary VALUES (80, NULL, 'Inventory Failure', 'ticket-type', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (81, NULL, 'Missing Vendor Alias', 'ticket-type', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (82, NULL, 'DB Load Error', 'ticket-type', NULL, NULL, NULL);


