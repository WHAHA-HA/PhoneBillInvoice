INSERT INTO common_dictionary VALUES (100, 'sp_serv_id', 'SPID', 'gl-rule-field', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (101, 'acct_level_1', 'SubAccount', 'gl-rule-field', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (102, 'chg_code_1', 'Charge Description 1 Code', 'gl-rule-field', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (103, 'chg_desc_1', 'Charge Description 1', 'gl-rule-field', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (104, 'chg_code_2', 'Charge Description 2 Code', 'gl-rule-field', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (105, 'chg_desc_2', 'Charge Description 2', 'gl-rule-field', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (106, 'chg_code_3', 'Charge Description 3 Code', 'gl-rule-field', NULL, NULL, NULL);
INSERT INTO common_dictionary VALUES (107, 'chg_desc_3', 'Charge Description 3', 'gl-rule-field', NULL, NULL, NULL);


CREATE SEQUENCE glrules_glcodes_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;


CREATE SEQUENCE gl_rules_rule_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;


CREATE TABLE gl_rules
(
  id integer NOT NULL DEFAULT nextval('gl_rules_rule_id_seq'::regclass),
  rule_desc character varying,
  fld1_name character varying,
  fld1_match_value character varying,
  fld2_name character varying,
  fld2_match_value character varying,
  fld3_name character varying,
  fld3_match_value character varying,
  fld4_name character varying,
  fld4_match_value character varying,
  fld5_name character varying,
  fld5_match_value character varying,
  fld6_name character varying,
  fld6_match_value character varying,
  fld7_name character varying,
  fld7_match_value character varying,
  fld8_name character varying,
  fld8_match_value character varying,
  rule_name character varying,
  fld1_operator json,
  fld2_operator json,
  fld3_operator json,
  fld4_operator json,
  fld5_operator json,
  fld6_operator json,
  fld7_operator json,
  fld8_operator json,
  CONSTRAINT gl_rules_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


CREATE TABLE gl_rules_glcodes
(
  id integer NOT NULL DEFAULT nextval('glrules_glcodes_id_seq'::regclass),
  rule_id integer,
  gl_code_seg1 character varying,
  gl_code_seg2 character varying,
  gl_code_seg3 character varying,
  gl_code_seg4 character varying,
  gl_code_seg5 character varying,
  gl_code_seg6 character varying,
  gl_code_seg7 character varying,
  gl_code_seg8 character varying,
  apportion_pct double precision,
  gl_string_id integer,
  CONSTRAINT gl_rules_glcodes_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


ALTER TABLE gl_strings
DROP segment1,
DROP segment2,
DROP segment3,
DROP segment4,
DROP segment5,
DROP segment6,
DROP segment7,
DROP segment8,
DROP segment9,
DROP segment10,
ADD COLUMN segment1 integer,
ADD COLUMN segment2 integer,
ADD COLUMN segment3 integer,
ADD COLUMN segment4 integer,
ADD COLUMN segment5 integer,
ADD COLUMN segment6 integer,
ADD COLUMN segment7 integer,
ADD COLUMN segment8 integer,
ADD COLUMN segment9 integer,
ADD COLUMN segment10 integer;




