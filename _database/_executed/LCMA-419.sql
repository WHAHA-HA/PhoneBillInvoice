ALTER TABLE "order_header"
ADD type_id integer,
DROP COLUMN type;
ALTER TABLE order_header ADD COLUMN tot_svc_items integer;
