alter table appdata_site
drop column type_id;

alter table appdata_employee
rename column "status" to "status_id";
