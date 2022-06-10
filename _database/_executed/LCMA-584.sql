UPDATE appdata_site SET building_id = (SELECT id FROM appdata_building LIMIT 1);

ALTER TABLE appdata_site
DROP address1,
DROP address2,
DROP address3,
DROP city,
DROP state,
DROP zip,
ADD floor integer,
ADD room character varying(50),
ADD CONSTRAINT building FOREIGN KEY (building_id) REFERENCES "appdata_building";

ALTER TABLE appdata_equipment
DROP site_type,
DROP site_name,
DROP building_name,
DROP building_address,
DROP floor,
DROP room,
DROP building_city,
DROP building_state,
DROP building_zip,
ADD CONSTRAINT site FOREIGN KEY (site_id) REFERENCES appdata_site;


CREATE TABLE appdata_equipment_interface
(
  id serial NOT NULL,
  equip_id integer,
  interface_type character varying,
  interface_status character varying,
  interface_ip_address character varying,
  CONSTRAINT appdata_equipment_interface_pkey PRIMARY KEY (id),
  CONSTRAINT appdata_equipment_interface_equip_id_fkey FOREIGN KEY (equip_id)
      REFERENCES appdata_equipment (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
