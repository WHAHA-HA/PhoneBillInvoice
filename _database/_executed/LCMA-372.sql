ALTER TABLE 'order_header'
ADD  vendor_ack_date date,
ADD vendor_reject_date date,
ADD justification_description character varying(4000),
ADD additional_info character varying(4000),
DROP COLUMN tot_svc_items,
DROP COLUMN est_mrc,
DROP COLUMN est_nrc;

ALTER TABLE order_service
ADD description character varying(4000),
ADD foc_date_history json[],
ADD active boolean NOT NULL DEFAULT true;


INSERT INTO common_dictionary VALUES (72, NULL, 'Not in budget', 'order-reject-reason', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (73, NULL, 'Too expensive', 'order-reject-reason', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (74, NULL, 'Other', 'order-reject-reason', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (75, NULL, 'Vendor Missed', 'order-service-missed-reason', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (76, NULL, 'Customer Not Ready', 'order-service-missed-reason', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (77, NULL, 'Other', 'order-service-missed-reason', NULL, NULL, NULL);
