
ALTER TABLE "order_header"
ADD type_id integer DEFAULT 8,
DROP COLUMN type;

UPDATE "order_header" SET type_id = 8 WHERE id>0;

