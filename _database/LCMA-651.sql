DELETE FROM common_dictionary WHERE "group" = 'order-status';

INSERT INTO common_dictionary VALUES (124, '80', 'Approved', 'order-status', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (125, '110', 'Sent to Vendor', 'order-status', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (129, '206', 'Vendor Accept Received', 'order-status', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (122, '20', 'Ready for Approval', 'order-status', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (120, '1', 'New', 'order-status', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (121, '4', 'New (Rejected)', 'order-status', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (123, '6', 'Ready for Approval (Prior Reject)', 'order-status', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (126, '120', 'Sent to Vendor (Rework)', 'order-status', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (127, '150', 'Vendor Ack Date', 'order-status', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (128, '220', 'Vendor Reject', 'order-status', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (130, '600', 'Complete', 'order-status', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (131, '300', 'Cancelled', 'order-status', NULL, NULL, NULL);
