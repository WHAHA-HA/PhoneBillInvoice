ALTER TABLE "order_service" 
ADD ack_date_history json[],
ADD install_date_history json[],
ADD des_due_date_history json[],
ADD accept_date_history json[];
