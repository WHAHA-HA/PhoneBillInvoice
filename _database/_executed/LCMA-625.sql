ALTER TABLE inventory_detail
ADD COLUMN unique_id character varying(255);

update inventory_detail set unique_id = sp_ckt_id where type_id = 24;
