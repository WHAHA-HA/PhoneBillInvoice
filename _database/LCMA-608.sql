alter table "inventory_detail"
alter column technology_id type integer using technology_id::integer,
alter column ckt_type_id type integer using ckt_type_id::integer,
alter column ckt_usage_id type integer using ckt_usage_id::integer,
alter column bw_model_id type integer using bw_model_id::integer,
alter column protected_id type integer using protected_id::integer,
alter column prim_failover_id type integer using prim_failover_id::integer;



alter table "inventory_detail"
drop column client,
add column client integer;


