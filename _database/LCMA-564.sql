ALTER TABLE order_header ADD COLUMN order_number character varying;
ALTER TABLE order_header ADD COLUMN purchase_number character varying;
ALTER TABLE order_header ADD COLUMN ack_date timestamp(6) with time zone;
ALTER TABLE order_header ADD COLUMN accept_date timestamp(6) with time zone;
ALTER TABLE order_header ADD COLUMN complete_date timestamp(6) with time zone;
