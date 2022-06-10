CREATE TABLE gl_output
(
  ban character varying,
  inv_id character varying,
  chg_id integer,
  run_id character varying,
  run_date date,
  proc_typ character varying,
  rule_id character varying,
  approved_flag character varying,
  cktid character varying,
  gl_seg1_code character varying,
  gl_seg2_code character varying,
  gl_seg3_code character varying,
  gl_seg4_code character varying,
  gl_seg5_code character varying,
  gl_seg6_code character varying,
  gl_seg7_code character varying,
  gl_seg8_code character varying,
  gl_seg9_code character varying,
  gl_seg10_code character varying,
  full_chg_amt double precision,
  gl_chg_amt double precision,
  gl_apportion_pct double precision
)
WITH (
  OIDS=FALSE
);
