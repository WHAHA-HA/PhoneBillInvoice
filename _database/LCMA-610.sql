
CREATE SEQUENCE inventory_document_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;


CREATE SEQUENCE inventory_document_map_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1

-- Table: inventory_document

-- DROP TABLE inventory_document;

CREATE TABLE inventory_document
(
  id integer NOT NULL DEFAULT nextval('inventory_document_id_seq'::regclass),
  path character varying(2000),
  type character varying(250),
  description character varying,
  contract_type_id integer,
  effective_date date,
  term integer,
  exp_date date,
  mrc integer,
  nrc integer,
  CONSTRAINT inventory_document_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE inventory_document
  OWNER TO postgres;


-- Table: inventory_document_map

-- DROP TABLE inventory_document_map;

CREATE TABLE inventory_document_map
(
  id integer NOT NULL DEFAULT nextval('inventory_document_map_id_seq'::regclass),
  inventory_id integer,
  inventory_document_id integer,
  CONSTRAINT inventory_document_map_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE inventory_document_map
  OWNER TO postgres;


  INSERT INTO common_dictionary (id, custom_key, value, "group", order_number, abbreviation, color) VALUES (108, NULL, 'MSA', 'contract-type', NULL, NULL, NULL);
  INSERT INTO common_dictionary (id, custom_key, value, "group", order_number, abbreviation, color) VALUES (109, NULL, 'Svc Schedule', 'contract-type', NULL, NULL, NULL);
  INSERT INTO common_dictionary (id, custom_key, value, "group", order_number, abbreviation, color) VALUES (110, NULL, 'SS Amendment', 'contract-type', NULL, NULL, NULL);
  INSERT INTO common_dictionary (id, custom_key, value, "group", order_number, abbreviation, color) VALUES (112, NULL, 'Svc Order', 'contract-type', NULL, NULL, NULL);
  INSERT INTO common_dictionary (id, custom_key, value, "group", order_number, abbreviation, color) VALUES (113, NULL, 'Quote', 'contract-type', NULL, NULL, NULL);
  INSERT INTO common_dictionary (id, custom_key, value, "group", order_number, abbreviation, color) VALUES (114, NULL, 'Supporting Doc', 'contract-type', NULL, NULL, NULL);
  INSERT INTO common_dictionary (id, custom_key, value, "group", order_number, abbreviation, color) VALUES (115, NULL, 'Settlement Agreement', 'contract-type', NULL, NULL, NULL);

