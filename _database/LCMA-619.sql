ALTER TABLE order_header
ALTER COLUMN ready_for_approval TYPE timestamp(6) with time zone,
ALTER COLUMN vendor_accept_date TYPE timestamp(6) with time zone,
ALTER COLUMN vendor_reject_date TYPE timestamp(6) with time zone,
ALTER COLUMN ack_date TYPE timestamp(6) with time zone,
ALTER COLUMN request_date TYPE timestamp(6) with time zone,
ALTER COLUMN send_date TYPE timestamp(6) with time zone,
ALTER COLUMN created_at TYPE timestamp(6) with time zone,
ALTER COLUMN approve_date TYPE timestamp(6) with time zone,
ALTER COLUMN due_date TYPE timestamp(6) with time zone,
ALTER COLUMN initiate_date TYPE timestamp(6) with time zone,
ALTER COLUMN next_status_date TYPE timestamp(6) with time zone;