UPDATE "inventory_detail" SET sp_svc_id =  substring(md5(random()::text),1,6) WHERE id > 0;
ALTER TABLE "inventory_detail" ALTER COLUMN  sp_svc_id SET NOT NULL;

