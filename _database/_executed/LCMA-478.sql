CREATE TABLE gl_strings
(
  id serial NOT NULL,
  segment1 character varying,
  segment2 character varying,
  segment3 character varying,
  segment4 character varying,
  segment5 character varying,
  segment6 character varying,
  segment7 character varying,
  segment8 character varying,
  segment9 character varying,
  segment10 character varying,
  date_added date,
  gl_code_type character varying,
  status boolean,
  user_created integer
  CONSTRAINT gl_strings_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


CREATE SEQUENCE gl_inv_glseg10_codes_nonver_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

CREATE SEQUENCE gl_strings_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;



CREATE TABLE gl_inv_glseg_codes_nonver
(
  id integer NOT NULL DEFAULT nextval('gl_inv_glseg10_codes_nonver_id_seq'::regclass),
  segment_value character varying,
  segment_desc character varying,
  segment integer,
  CONSTRAINT gl_inv_glseg10_codes_nonver_pkey PRIMARY KEY (id),
  CONSTRAINT gl_inv_glseg_codes_nonver_segment_fkey FOREIGN KEY (segment)
      REFERENCES common_dictionary (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);

INSERT INTO common_dictionary VALUES (90, 'segment1', 'Segment 1', 'gl-code-segment', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (91, 'segment2', 'Segment 2', 'gl-code-segment', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (92, 'segment3', 'Segment 3', 'gl-code-segment', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (93, 'segment4', 'Segment 4', 'gl-code-segment', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (94, 'segment5', 'Segment 5', 'gl-code-segment', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (95, 'segment6', 'Segment 6', 'gl-code-segment', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (96, 'segment7', 'Segment 7', 'gl-code-segment', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (97, 'segment8', 'Segment 8', 'gl-code-segment', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (98, 'segment9', 'Segment 9', 'gl-code-segment', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (99, 'segment10', 'Segment 10', 'gl-code-segment', NULL, NULL, NULL);
