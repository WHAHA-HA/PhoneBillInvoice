alter table inventory_detail
alter column sp_svc_id drop not null;

alter table order_header
add ready_for_approval date;

alter table order_header
add vendor_accept_date date;


ALTER TABLE order_header
RENAME COLUMN vendor_ack_date TO ack_date;
