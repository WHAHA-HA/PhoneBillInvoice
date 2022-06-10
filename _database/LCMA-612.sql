delete from gl_strings;


ALTER TABLE gl_strings ADD CONSTRAINT gl_strings_pkey PRIMARY KEY (id);

CREATE TABLE gl_inventory_codes
(
  id serial NOT NULL,
  inv_id integer NOT NULL,
  gl_string_id integer NOT NULL,
  apportion_pct numeric(5,2),
  CONSTRAINT gl_inventory_codes_pkey PRIMARY KEY (id),
  CONSTRAINT gl_inventory_codes_gl_string_id_fkey FOREIGN KEY (gl_string_id)
      REFERENCES gl_strings (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT gl_inventory_codes_inv_id_fkey FOREIGN KEY (inv_id)
      REFERENCES inventory_detail (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
