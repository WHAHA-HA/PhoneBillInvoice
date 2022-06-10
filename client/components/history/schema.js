(function () {
    'use strict';

    angular.module('lcma')
            .factory('Schema', function (DS) {

                return {
                    "data": {
                        "project": {
                            title: "Project",
                            title_column: "project_id",
                            fields: [
                                {
                                    value: "project_id",
                                    label: "Project ID"
                                },
                                {
                                    value: "name",
                                    label: "Name"
                                },
                                {
                                    value: "owner",
                                    label: "Owner"
                                },
                                {
                                    value: "status_id",
                                    label: "Status ID"
                                },
                                {
                                    value: "start_date",
                                    label: "Start Date",
                                    type: "date"
                                },
                                {
                                    value: "end_date",
                                    label: "End Date",
                                    type: "date"
                                }]
                        },
                        "contract": {
                            title: "Contract",
                            title_column: "id",
                            fields: [
                                {
                                    value: "name",
                                    label: "Name"
                                }, {
                                    value: "master_id",
                                    label: "Parent"
                                }, {
                                    value: "description",
                                    label: "Description"
                                }, {
                                    value: "type",
                                    label: "Type"
                                }, {
                                    value: "vendor_id",
                                    label: "Vendor"
                                }, {
                                    value: "vendor_sign_date",
                                    label: "Vendor Signed",
                                    type: "date"
                                }, {
                                    value: "company_name",
                                    label: "Company"
                                }, {
                                    value: "company_sign_date",
                                    label: "Company Signed",
                                    type: "date"
                                }, {
                                    value: "effective_date",
                                    label: "Effective Date",
                                    type: "date"
                                }, {
                                    value: "termination_date",
                                    label: "Termination Date",
                                    type: "date"
                                }, {
                                    value: "term_months",
                                    label: "Term"
                                }, {
                                    value: "committed_value",
                                    label: "Committed Value"
                                }]
                        },
                        "account": {
                            title: "Account",
                            title_column: "account_no",
                            fields: [
                                {
                                    value: "id",
                                    label: "Unique ID"
                                },
                                {
                                    value: "vendor",
                                    label: "Vendor"
                                },
                                {
                                    value: "account_no",
                                    label: "Account"
                                },
                                {
                                    value: "status.value",
                                    label: "Status"
                                },
                                {
                                    value: "vendor_alias",
                                    label: "Vendor Alias"
                                },
                                {
                                    value: "ap_vendor_id",
                                    label: "AP Vendor ID"
                                },
                                {
                                    value: "billing_cycle",
                                    label: "Bill Cycle"
                                },
                                {
                                    value: "late_bill_log_days",
                                    label: "Late Bill Log Days"
                                }
                            ]
                        },
                        "order": {
                            title: "Order",
                            title_column: "id",
                            fields: [
                                {
                                    value: "vendor_id",
                                    label: "Vendor"
                                },
                                {
                                    value: "id",
                                    label: "Order ID"
                                },
                                {
                                    value: "approve_date",
                                    label: "Approve Date",
                                    type: "date"
                                },
                                {
                                    value: "tot_svc_items",
                                    label: "Total Svc Items"
                                },
                                {
                                    value: "requester_id",
                                    label: "Requester"
                                },
                                {
                                    value: "request_date",
                                    label: "Request Date",
                                    type: "date"
                                },
                                {
                                    value: "approver_id",
                                    label: "Approver"
                                },
                                {
                                    value: "est_mrc",
                                    label: "Total Est MRC"
                                },
                                {
                                    value: "processor_id",
                                    label: "Processor"
                                },
                                {
                                    value: "created_at",
                                    label: "Create Date",
                                    type: "date"
                                },
                                {
                                    value: "send_date",
                                    label: "Sent Date"
                                },
                                {
                                    value: "est_nrc",
                                    label: "Total Est NRC"
                                },
                                {
                                    value: "project_id",
                                    label: "Project"
                                }
                            ]
                        },
                        "inventory": {
                            title: "Inventory",
                            title_column: "id",
                            fields: [
                                {
                                    value: "acct_number",
                                    label: "Acct Number"
                                },
                                {
                                    value: "acq_cost",
                                    label: "Acq Cost"
                                },
                                {
                                    value: "acq_date",
                                    label: "Acq Date",
                                    type: "date"
                                },
                                {
                                    value: "application",
                                    label: "Application"
                                },
                                {
                                    value: "ban",
                                    label: "BAN"
                                },
                                {
                                    value: "bnt",
                                    label: "BNT"
                                },
                                {
                                    value: "bw_max",
                                    label: "Bw Max"
                                },
                                {
                                    value: "bw_model_id",
                                    label: "Bw Model ID"
                                },
                                {
                                    value: "byod",
                                    label: "Byod"
                                },
                                {
                                    value: "carrier",
                                    label: "Carrier"
                                },
                                {
                                    value: "cir_bw",
                                    label: "Cir Bw"
                                },
                                {
                                    value: "ckt_type_id",
                                    label: "Ckt Type ID"
                                },
                                {
                                    value: "ckt_usage_id",
                                    label: "Ckt Usage ID"
                                },
                                {
                                    value: "acq_date",
                                    label: "Acq Date",
                                    type: "date"
                                },
                                {
                                    value: "client",
                                    label: "Client"
                                },
                                {
                                    value: "conc_calls",
                                    label: "Conc Calls"
                                },
                                {
                                    value: "contract_id",
                                    label: "Contract ID"
                                },
                                {
                                    value: "cust_codec",
                                    label: "Cust Codec"
                                },
                                {
                                    value: "cust_ip_host",
                                    label: "Cust IP Host"
                                },
                                {
                                    value: "cust_port",
                                    label: "Cust port"
                                },
                                {
                                    value: "data_pool_id",
                                    label: "Data Pool ID"
                                },
                                {
                                    value: "device_name",
                                    label: "Device Name"
                                },
                                {
                                    value: "direction_id",
                                    label: "Direction ID"
                                },
                                {
                                    value: "disc_date",
                                    label: "Disc Date",
                                    type: "date"
                                },
                                {
                                    value: "dns_ip",
                                    label: "DNS IP"
                                },
                                {
                                    value: "emp_id",
                                    label: "Emp ID"
                                },
                                {
                                    value: "est_mrc",
                                    label: "Est. mrc"
                                },
                                {
                                    value: "est_nrc",
                                    label: "Est. nrc"
                                },
                                {
                                    value: "exp_date",
                                    label: "Exp Date",
                                    type: "date"
                                },
                                {
                                    value: "fac_bw",
                                    label: "Fac BW"
                                },
                                {
                                    value: "fail_rel_svc",
                                    label: "Fail Rel Svc"
                                },
                                {
                                    value: "fax_protocol",
                                    label: "Fax Protocol"
                                },
                                {
                                    value: "gw_id",
                                    label: "GW ID"
                                },
                                {
                                    value: "gw_ip_addr",
                                    label: "GW IP Addr"
                                },
                                {
                                    value: "hunt_group_id",
                                    label: "Hunt Group ID"
                                },
                                {
                                    value: "id",
                                    label: "ID"
                                },
                                {
                                    value: "ins_contract",
                                    label: "Ins Contract"
                                },
                                {
                                    value: "ins_mo_fee",
                                    label: "Ins Mo Fee"
                                },
                                {
                                    value: "ins_vendor",
                                    label: "Ins Vendor"
                                },
                                {
                                    value: "install_date",
                                    label: "Install Date",
                                    type: "date"
                                },
                                {
                                    value: "int_ckt_id",
                                    label: "Int Ckt ID"
                                },
                                {
                                    value: "int_dev_id",
                                    label: "Int Dev ID"
                                },
                                {
                                    value: "int_plan_id",
                                    label: "Int Plan ID"
                                },
                                {
                                    value: "int_svc_id",
                                    label: "Int Svc ID"
                                },
                                {
                                    value: "int_trunk_id",
                                    label: "Int Trunk ID"
                                },
                                {
                                    value: "internal_id",
                                    label: "Internal ID"
                                },
                                {
                                    value: "ip_shared_trk_id",
                                    label: "IP Shared Trk ID"
                                },
                                {
                                    value: "last_bh_utilization",
                                    label: "Last BH Utilization"
                                },
                                {
                                    value: "maker",
                                    label: "Maker"
                                },
                                {
                                    value: "mdm_contract",
                                    label: "MDM Contract"
                                },
                                {
                                    value: "mdm_vendor",
                                    label: "MDM Vendor"
                                },
                                {
                                    value: "mems_cc_qty",
                                    label: "Mems CC Qty"
                                },
                                {
                                    value: "mobile_device_type_id",
                                    label: "Mobile Device Type ID"
                                },
                                {
                                    value: "mobile_nbr",
                                    label: "Mobile Number"
                                },
                                {
                                    value: "model_no",
                                    label: "Model No"
                                },
                                {
                                    value: "ob_proxy_ip",
                                    label: "Ob Proxy IP"
                                },
                                {
                                    value: "ob_proxy_port",
                                    label: "Ob Proxy Port"
                                },
                                {
                                    value: "plan_type_id",
                                    label: "Plan Type ID"
                                },
                                {
                                    value: "prim_failover_id",
                                    label: "Prim Failover ID"
                                },
                                {
                                    value: "protected_id",
                                    label: "Protected ID"
                                },
                                {
                                    value: "proxy_ip_host",
                                    label: "Proxy IP Host"
                                },
                                {
                                    value: "reg_ip_host",
                                    label: "Reg IP Host"
                                },
                                {
                                    value: "rel_plan_id",
                                    label: "Rel Plan ID"
                                },
                                {
                                    value: "rel_svc",
                                    label: "Rel Svc"
                                },
                                {
                                    value: "resp_org",
                                    label: "Resp Org"
                                },
                                {
                                    value: "rtp_port_ring",
                                    label: "RTP Port Ring"
                                },
                                {
                                    value: "rtp_ports",
                                    label: "RTP Ports"
                                },
                                {
                                    value: "second_proxy_ip",
                                    label: "Second Proxy IP"
                                },
                                {
                                    value: "second_proxy_port",
                                    label: "Second Proxy Port"
                                },
                                {
                                    value: "second_sp_id",
                                    label: "Second SP ID"
                                },
                                {
                                    value: "service",
                                    label: "Service"
                                },
                                {
                                    value: "sip_domain",
                                    label: "SIP Domain"
                                },
                                {
                                    value: "site_a_id",
                                    label: "Site A ID"
                                },
                                {
                                    value: "site_domain",
                                    label: "Site Domain"
                                },
                                {
                                    value: "site_id",
                                    label: "Site ID"
                                },
                                {
                                    value: "site_z_id",
                                    label: "Site Z ID"
                                },
                                {
                                    value: "sms_template_id",
                                    label: "SMS Template ID"
                                },
                                {
                                    value: "sp_btn",
                                    label: "SP Btn"
                                },
                                {
                                    value: "sp_ckt_id",
                                    label: "SP Ckt ID"
                                },
                                {
                                    value: "sp_codec",
                                    label: "SP Codec"
                                },
                                {
                                    value: "sp_dev_id",
                                    label: "SP Dev ID"
                                },
                                {
                                    value: "sp_svc_id",
                                    label: "SP Svc ID"
                                },
                                {
                                    value: "sp_trunk_id",
                                    label: "SP Trunk ID"
                                },
                                {
                                    value: "status_id",
                                    label: "Status ID"
                                },
                                {
                                    value: "svc_type_id",
                                    label: "Svc Type ID"
                                },
                                {
                                    value: "technology_id",
                                    label: "Technology ID"
                                },
                                {
                                    value: "telephone_number",
                                    label: "Telephone Number"
                                },
                                {
                                    value: "telephone_number_status_id",
                                    label: "Telephone Number Satus ID"
                                },
                                {
                                    value: "term",
                                    label: "Term"
                                },
                                {
                                    value: "term_date",
                                    label: "Term Date",
                                    type: "date"
                                },
                                {
                                    value: "toll_free_number",
                                    label: "Toll Free Number"
                                },
                                {
                                    value: "toll_free_number_status_id",
                                    label: "Toll Free Number Status ID"
                                },
                                {
                                    value: "topology_id",
                                    label: "Topology ID"
                                },
                                {
                                    value: "trunk_grp_id",
                                    label: "Trunk Grp ID"
                                },
                                {
                                    value: "trunk_type_id",
                                    label: "Trunk Type ID"
                                },
                                {
                                    value: "type_id",
                                    label: "Type ID"
                                },
                                {
                                    value: "upgrade_date",
                                    label: "Upgrade Date",
                                    type: "date"
                                },
                                {
                                    value: "username",
                                    label: "Username"
                                },
                                {
                                    value: "vendor_id",
                                    label: "Vendor ID"
                                },
                                {
                                    value: "voice_pool_id",
                                    label: "Voice Pool ID"
                                }

                            ]
                        },
                        "audit": {
                            title: "Audit",
                            title_column: "name",
                            fields: [
                                {
                                    value: "vendor_id",
                                    label: "Vendor"
                                },
                                {
                                    value: "invoice_qty",
                                    label: "Invoice Qty"
                                },
                                {
                                    value: "invoice_type_id",
                                    label: "Invoice Type"
                                },
                                {
                                    value: "invoice_charges",
                                    label: "Invoice Charges"
                                },
                                {
                                    value: "name",
                                    label: "Audit Name"
                                }
                            ]
                        },
                        "dispute": {
                            title: "Dispute",
                            title_column: "dispute_id",
                            fields: [
                                {
                                    value: "id",
                                    label: "ID"
                                },
                                {
                                    value: "user_id",
                                    label: "User"
                                },
                                {
                                    value: "created_at",
                                    label: "Created At",
                                    type: "date"
                                },
                                {
                                    value: "status",
                                    label: "Status"
                                },
                                {
                                    value: "status_changed_at",
                                    label: "Status Changed At"
                                },
                                {
                                    value: "content",
                                    label: "Content"
                                },
                                {
                                    value: "dispute_id",
                                    label: "Dispute ID"
                                },
                                {
                                    value: "category_id",
                                    label: "Category ID"
                                },
                                {
                                    value: "Disp Stat DT",
                                    label: "disp_stat_dt"
                                }
                            ]
                        },
                        "order_service": {
                            title: "Order Service",
                            title_column: "id",
                            fields: [
                                {
                                    value: "ack_date",
                                    label: "Ack Date",
                                    type: "date"
                                },
                                {
                                    value: "foc_rec_date",
                                    label: "Foc Rec Date",
                                    type: "date"
                                },
                                {
                                    value: "des_due_date",
                                    label: "Des Due Date",
                                    type: "date"
                                },
                                {
                                    value: "foc_date",
                                    label: "FOC Date",
                                    type: "date"
                                },
                                {
                                    value: "install_date",
                                    label: "Install Date",
                                    type: "date"
                                },
                                {
                                    value: "expedited_order",
                                    label: "Expedited Order"
                                },
                                {
                                    value: "accept_date",
                                    label: "Accept Date",
                                    type: "date"
                                },
                                {
                                    value: "accepted_by",
                                    label: "Accepted By"
                                },
                                {
                                    value: "order_id",
                                    label: "Order ID"
                                },
                                {
                                    value: "notes",
                                    label: "Notes"
                                },
                                {
                                    value: "status_id",
                                    label: "Status ID"
                                },
                                {
                                    value: "site_id",
                                    label: "Site ID"
                                },
                                {
                                    value: "inventory_id",
                                    label: "Inventory ID"
                                },
                                {
                                    value: "state",
                                    label: "Flow State"
                                },
                            ]
                        },
                    }

                };
            });

}());