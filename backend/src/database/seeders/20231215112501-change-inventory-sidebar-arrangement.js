"use strict";

const {
    ALL_MASTERS_LIST,
    USER_MASTER_PERMISSIONS,
    ROLE_MASTER_PERMISSIONS
} = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */

const schemaName = "public";

const allInsert = [
    {
        id: "f89bad62-386a-4752-b009-60444764be01",
        visible_name: "Goods Receive Note (GRN)",
        rank: 1
    },
    {
        id: "2d7c2c3f-9d66-4d7e-94fd-4867caa428f1",
        visible_name: "Material Requisition Form (MRF)",
        rank: 2
    },
    {
        id: "cb0cb1c0-e752-462b-89cc-1266b002cda5",
        visible_name: "Material Issue Note (MIN)",
        rank: 3
    },
    {
        id: "386852ba-916a-4eea-96a2-3cbbf6aa53bf",
        visible_name: "Contractor To Installer (CTI)",
        rank: 4
    },
    {
        id: "c2cd7ae6-2e75-44b8-ade5-fac419d5401f",
        visible_name: "Installer To Installer (ITI)",
        rank: 5
    },
    {
        id: "6a474e8e-c6e1-4ee8-9d31-607b33b40c1d",
        visible_name: "Installer To Contractor (ITC)",
        rank: 6
    },
    {
        id: "4a620e2e-cca6-4165-935e-6f4300b41240",
        visible_name: "Location To Location (LTL)",
        rank: 7
    },
    {
        id: "18f43b5c-2a85-4258-80f5-3fb64d48a4e8",
        visible_name: "Material Return Request (MRR)",
        rank: 8
    },
    {
        id: "debd8fb0-f079-45af-be3c-47197bd15acd",
        visible_name: "Material Return Note (MRN)",
        rank: 9
    },
    {
        id: "2c512520-59e6-4ef2-8f0a-dd90ef6fbfbc",
        visible_name: "Return MRN",
        rank: 10
    },
    {
        id: "fbc6590f-0d94-43a8-9680-f1cca84e8540",
        visible_name: "Store To Service Center (STSRC)",
        rank: 11
    },
    {
        id: "2cd4c64d-ef44-408f-a133-7c685bdb57b8",
        visible_name: "Service Center To Store (SRCTS)",
        rank: 12
    },
    {
        id: "c0764656-38a5-4de1-987d-30a66f0e675b",
        visible_name: "Stock Transfer Request (STR)",
        rank: 13
    },
    {
        id: "0b2bd9b1-b133-47b1-991b-d3aabd415465",
        visible_name: "Stock Transfer Order (STO)",
        rank: 14
    },
    {
        id: "46cce353-0789-43ec-9345-002fad7a53cd",
        visible_name: "Stock Transfer Order GRN",
        rank: 15
    },
    {
        id: "24b7eb65-d1c1-4f83-872c-ac7d8cb34a8e",
        visible_name: "Store To Customer (STC)",
        rank: 16
    },
    {
        id: "a7187ec1-ab46-4b84-8d01-98bec9e2bdf1",
        visible_name: "Customer To Store (CTS)",
        rank: 17
    },
    {
        id: "7d208060-50b0-4ad1-b8fb-e90e010dfbd6",
        visible_name: "Project To Project (PTP)",
        rank: 18
    },
    {
        id: "214f336b-eb0c-4149-822f-4b4a1e4a71b0",
        visible_name: "Consumption Request",
        rank: 19
    },
    {
        id: "da76e970-406c-43fc-86f2-385c56f4aa8c",
        visible_name: "Consumption",
        rank: 20
    },
    {
        id: "aaf1e730-54a1-4381-9362-7b5081faf398",
        visible_name: "Consumption Return",
        rank: 21
    },
    {
        id: "7666e309-6a06-435c-8046-70fa63f1d310",
        visible_name: "Project To Project Request (PTPR)",
        rank: 100 // setting high rank as this entry will be removed later
    }
];

const commonAllMastersInsert = {
    access_flag: true,
    parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e",
    grand_parent_id: "008a743f-e7df-4c2a-b9c2-c12682c90276",
    is_master: false,
    lov_access: false,
    table_type: "table",
    is_active: "1"
};

const allTerminalMastersInsert = [
    {
        id: "9cd94808-31fd-4250-95fe-42b058cdd24e",
        name: "create_return_mrn",
        visible_name: "Create Return MRN",
        master_route: "/return-mrn",
        rank: 1,
        parent_id: "2c512520-59e6-4ef2-8f0a-dd90ef6fbfbc", // Return MRN
        grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e", // Transactions
        access_flag: true,
        is_master: false,
        lov_access: false,
        table_type: "table",
        is_active: "1"
    },
    {
        id: "e12588e2-f018-4d9c-8182-4701d4e637cb",
        name: "cancel_return_mrn",
        visible_name: "Cancel Return MRN",
        master_route: "/cancel-return-mrn",
        rank: 3,
        parent_id: "2c512520-59e6-4ef2-8f0a-dd90ef6fbfbc", // Return MRN
        grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e", // Transactions
        access_flag: true,
        is_master: false,
        lov_access: false,
        table_type: "table",
        is_active: "1"
    }
];

const updates = [
    {
        newValues: {
            rank: 1,
            visible_name: "Create GRN",
            parent_id: "f89bad62-386a-4752-b009-60444764be01", // Goods Receive Note(GRN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "79e923a8-d821-4945-aca0-8f1ca34ea400" // Create GRN
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "f89bad62-386a-4752-b009-60444764be01", // Goods Receive Note(GRN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "d2ff0f01-82ae-4805-b97e-ffffd3aea7fe" // GRN Receipt
        }
    },
    {
        newValues: {
            rank: 3,
            visible_name: "Cancel GRN",
            parent_id: "f89bad62-386a-4752-b009-60444764be01", // Goods Receive Note(GRN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "0647725f-060e-4566-b687-0824014db58e" // CancelGRN
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create MRF",
            parent_id: "2d7c2c3f-9d66-4d7e-94fd-4867caa428f1", // Material Requisition Form(MRF)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "da8aaef8-d4dc-4fb7-a601-813b2f159ef1" // Create MRF
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "2d7c2c3f-9d66-4d7e-94fd-4867caa428f1", // Material Requisition Form(MRF)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "b75ffc28-222e-471d-b9d8-beb0edabaa69" // MRF Receipt
        }
    },
    {
        newValues: {
            rank: 3,
            visible_name: "Cancel MRF",
            parent_id: "2d7c2c3f-9d66-4d7e-94fd-4867caa428f1", // Material Requisition Form(MRF)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "2be45821-86ef-42e4-a89d-dd1e826b0b98" // CancelMRF
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create MIN",
            parent_id: "cb0cb1c0-e752-462b-89cc-1266b002cda5", // Material Issue Note(MIN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "fbe5b6e3-f5c1-41a5-9be2-1bd13b33bf6a" // Create MIN
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "cb0cb1c0-e752-462b-89cc-1266b002cda5", // Material Issue Note(MIN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "e9927c28-0ee0-4b66-9edf-c7b78c2d8ef5" // MIN Receipt
        }
    },
    {
        newValues: {
            rank: 3,
            visible_name: "Cancel MIN",
            parent_id: "cb0cb1c0-e752-462b-89cc-1266b002cda5", // Material Issue Note(MIN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "649d22d1-edc8-4cbb-83b9-0f8d2cb56770" // CancelMIN
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create CTI",
            master_route: "/cti",
            parent_id: "386852ba-916a-4eea-96a2-3cbbf6aa53bf", // Contractor To Installer(CTI)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "6dc29ee0-fdce-45cc-bb60-910a2e4fc68a" // Create CTI
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create ITI",
            master_route: "/iti",
            parent_id: "c2cd7ae6-2e75-44b8-ade5-fac419d5401f", // Installer To Installer(ITI)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "c2dedb42-0bd3-4803-a417-a99bcca4fd97" // Create ITI
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create ITC",
            master_route: "/itc",
            parent_id: "6a474e8e-c6e1-4ee8-9d31-607b33b40c1d", // Installer To Contractor(ITC)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "99202fa3-dea6-47db-aa42-f9db7c97e41b" // Create ITC
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create LTL",
            master_route: "/ltl",
            parent_id: "4a620e2e-cca6-4165-935e-6f4300b41240", // Location To Location(LTL)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "0143792a-40ba-4ac8-8d21-3b610b95d4a5" // Create LTL
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "4a620e2e-cca6-4165-935e-6f4300b41240", // Location To Location(LTL)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "e4891a70-b647-4eb8-acdf-8bc07b5fbcd1" // LTL Receipt
        }
    },
    {
        newValues: {
            rank: 3,
            visible_name: "Cancel LTL",
            parent_id: "4a620e2e-cca6-4165-935e-6f4300b41240", // Location To Location(LTL)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "99cccb29-acd0-4f7a-a1a1-a5b2bcae6044" // CancelLTL
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create MRR",
            parent_id: "18f43b5c-2a85-4258-80f5-3fb64d48a4e8", // Material Return Request(MRR)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "b67c6397-80ca-4bc3-be5c-2a815983569e" // Create MRR
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "18f43b5c-2a85-4258-80f5-3fb64d48a4e8", // Material Return Request(MRR)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "56f4c3b5-2924-4f11-a1cb-66b3cb1001d1" // MRR Receipt
        }
    },
    {
        newValues: {
            rank: 3,
            visible_name: "Cancel MRR",
            parent_id: "18f43b5c-2a85-4258-80f5-3fb64d48a4e8", // Material Return Request(MRR)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "fe75c0f4-8e26-4cfd-8e9a-ec6a90575d96" // CancelMRR
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create MRN",
            parent_id: "debd8fb0-f079-45af-be3c-47197bd15acd", // Material Return Note(MRN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "53edc94a-beac-4d02-9d93-0b25a20e5103" // Create MRN
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "debd8fb0-f079-45af-be3c-47197bd15acd", // Material Return Note(MRN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "fe451c17-7a29-44d5-83a4-926e11571b89" // MRN Receipt
        }
    },
    {
        newValues: {
            rank: 3,
            visible_name: "Cancel MRN",
            parent_id: "debd8fb0-f079-45af-be3c-47197bd15acd", // Material Return Note(MRN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "7079a784-2620-495b-8462-a8ff43dc7c52" // CancelMRN
        }
    },

    {
        newValues: {
            rank: 2,
            parent_id: "2c512520-59e6-4ef2-8f0a-dd90ef6fbfbc", // Material Return Note(RETURNMRN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "0705f585-7ea0-40f8-ad9e-bf286c453b16" // RETURNMRN Receipt
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create STSRC",
            master_route: "/stsrc",
            parent_id: "fbc6590f-0d94-43a8-9680-f1cca84e8540", // Store To Service Center(STSRC)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "31ca0858-739e-44a4-9b92-f52995c67133" // Create STSRC
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create SRCTS",
            master_route: "/srcts",
            parent_id: "2cd4c64d-ef44-408f-a133-7c685bdb57b8", // Store To Service Center(SRCTS)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "56e52d5f-e560-4dc7-a7eb-f5cfaa016950" // Create SRCTS
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create STR",
            parent_id: "c0764656-38a5-4de1-987d-30a66f0e675b", // Stock Transfer Request(STR)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "e3067c19-3165-46c6-89fb-ab6160e022bd" // Create STR
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "c0764656-38a5-4de1-987d-30a66f0e675b", // Stock Transfer Request(STR)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "ec8dcf1c-6104-4f73-9349-6544d683a0bb" // STR Receipt
        }
    },
    {
        newValues: {
            rank: 3,
            visible_name: "Cancel STR",
            parent_id: "c0764656-38a5-4de1-987d-30a66f0e675b", // Stock Transfer Request(STR)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "7b82a396-1b51-46ef-9a16-356176851dd2" // CancelSTR
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create STO",
            master_route: "/sto",
            parent_id: "0b2bd9b1-b133-47b1-991b-d3aabd415465", // Stock Transfer Order(STO)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "8d492ae6-5683-4137-bc82-ac003815f163" // Create STO
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "0b2bd9b1-b133-47b1-991b-d3aabd415465", // Stock Transfer Order(STO)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "34ccbe64-98cf-4432-8a01-267e390106c3" // STO Receipt
        }
    },
    {
        newValues: {
            rank: 3,
            visible_name: "Cancel STO",
            parent_id: "0b2bd9b1-b133-47b1-991b-d3aabd415465", // Stock Transfer Order(STO)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "bc8e9559-27af-46c4-8a31-d20495b1ebec" // CancelSTO
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create STOGRN",
            parent_id: "46cce353-0789-43ec-9345-002fad7a53cd", // Stock Transfer Order GRN(STOGRN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "3767b3ab-c668-4430-b7a7-b2852a136662" // Create STOGRN
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "46cce353-0789-43ec-9345-002fad7a53cd", // Stock Transfer Order GRN(STOGRN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "05a8e33d-7825-40f8-a59d-5a641e4feefe" // STOGRN Receipt
        }
    },
    {
        newValues: {
            rank: 3,
            visible_name: "Cancel STOGRN",
            parent_id: "46cce353-0789-43ec-9345-002fad7a53cd", // Stock Transfer Order GRN(STOGRN)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "e528e850-d3f3-40bf-9a9b-adec863fd493" // CancelSTOGRN
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create STC",
            master_route: "/stc",
            parent_id: "24b7eb65-d1c1-4f83-872c-ac7d8cb34a8e", // Store To Customer(STC)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "50599a7c-d235-4cb2-88cf-7a7f81007c4a" // Create STC
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "24b7eb65-d1c1-4f83-872c-ac7d8cb34a8e", // Store To Customer(STC)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "5708b82f-449d-4745-9b55-e268246bf4ae" // STC Receipt
        }
    },
    {
        newValues: {
            rank: 3,
            visible_name: "Cancel STC",
            master_route: "/cancel-stc",
            parent_id: "24b7eb65-d1c1-4f83-872c-ac7d8cb34a8e", // Store To Customer(STC)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "d6a350e9-78e3-483c-86c0-80977c6683fc" // CancelSTC
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create CTS",
            master_route: "/cts",
            parent_id: "a7187ec1-ab46-4b84-8d01-98bec9e2bdf1", // Customer To Store(CTS)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "57286d60-26cf-4fbe-8a2b-6067b2b5c845" // Create CTS
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "a7187ec1-ab46-4b84-8d01-98bec9e2bdf1", // Customer To Store(CTS)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "e35a48ac-f902-4ba4-bf99-820fb381a2e9" // CTS Receipt
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create PTP",
            master_route: "/ptp",
            parent_id: "7d208060-50b0-4ad1-b8fb-e90e010dfbd6", // Project To Project(PTP)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "61849868-c6c8-4469-9352-72ea709f1ab0" // Create PTP
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "7d208060-50b0-4ad1-b8fb-e90e010dfbd6", // Project To Project(PTP)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "7dce6e80-9d57-408b-b6bc-fbb79880a154" // PTP Receipt
        }
    },
    {
        newValues: {
            rank: 3,
            visible_name: "Cancel PTP",
            parent_id: "7d208060-50b0-4ad1-b8fb-e90e010dfbd6", // Project To Project(PTP)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "97eed6ad-30a2-4d60-bc5d-960fe73777df" // CancelPTP
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create Consumption Request",
            parent_id: "214f336b-eb0c-4149-822f-4b4a1e4a71b0", // Consumption Request
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "fe9d247b-860e-449d-aa8d-cd3203e64e3f" // Create Consumption Request
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "214f336b-eb0c-4149-822f-4b4a1e4a71b0", // Consumption Request
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "82682fb0-638b-42e3-9def-c6525141629b" // Consumption Request Receipt
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create Consumption",
            parent_id: "da76e970-406c-43fc-86f2-385c56f4aa8c", // Consumption
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "85fdc0a5-a842-4136-a823-5b5500a4d3ff" // Create Consumption
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "da76e970-406c-43fc-86f2-385c56f4aa8c", // Consumption
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "144e1702-9935-4f48-9668-dcb8b1a4f843" // Consumption Receipt
        }
    },

    {
        newValues: {
            rank: 1,
            visible_name: "Create PTPR",
            parent_id: "7666e309-6a06-435c-8046-70fa63f1d310", // Project To Project Request(PTPR)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "44d10426-a348-4ad6-bd25-9f55e7ef1a62" // Create PTPR
        }
    },
    {
        newValues: {
            rank: 2,
            parent_id: "7666e309-6a06-435c-8046-70fa63f1d310", // Project To Project Request(PTPR)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "d1bc3a9e-a12b-4863-b922-b3f10c8088c9" // PTPR Receipt
        }
    },
    {
        newValues: {
            rank: 3,
            visible_name: "Cancel PTPR",
            parent_id: "7666e309-6a06-435c-8046-70fa63f1d310", // Project To Project(PTP)
            grand_parent_id: "5fe301bb-4b9d-4ffa-95dd-c0ab0216071e" // Transactions
        },
        where: {
            id: "8b7d1f0e-399e-464c-b0de-a9d230fe5a35" // CancelPTPR
        }
    }
];

const generateCreatePermissionQueries = (dataArray) => {
    const queries = [];

    dataArray.forEach((item) => {
        const masterId = item.where.id;
        const parentId = item.newValues.parent_id;
        const grandParentId = item.newValues.grand_parent_id;

        const [parentQuery, grandParentQuery] = [parentId, grandParentId].map((parentMasterId) => `
        WITH SelectedRow AS (
            SELECT user_id
            FROM ${schemaName}.${USER_MASTER_PERMISSIONS}
            WHERE master_id = '${masterId}'
        )
        INSERT INTO ${schemaName}.${USER_MASTER_PERMISSIONS} (id, master_id, user_id, created_at, updated_at)
        SELECT uuid_generate_v4(), '${parentId}', user_id, '2023-12-20 16:00:03.932134+05:30', '2023-12-20 16:00:03.932134+05:30'
        FROM SelectedRow
        WHERE NOT EXISTS (
            SELECT 1 FROM ${schemaName}.${USER_MASTER_PERMISSIONS}
            WHERE user_id = SelectedRow.user_id AND master_id = '${parentMasterId}'
        );`);

        queries.push(parentQuery, grandParentQuery);
    });

    return queries;
};

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            // insert new collapses
            await queryInterface.bulkInsert(
                ALL_MASTERS_LIST,
                allInsert.map((entry) => ({
                    ...commonAllMastersInsert,
                    ...entry
                })),
                { transaction }
            );

            // insert new terminal masters
            await queryInterface.bulkInsert(
                ALL_MASTERS_LIST,
                allTerminalMastersInsert,
                { transaction }
            );

            // update entries to use new collapses
            const updatePromises = updates.map((update) => {
                const setClause = Object.entries(update.newValues)
                    .map(([key, value]) => `"${key}" = '${value}'`)
                    .join(", ");

                const whereClause = Object.entries(update.where)
                    .map(([key, value]) => `"${key}" = '${value}'`)
                    .join(" AND ");

                const sql = `UPDATE ${schemaName}.${ALL_MASTERS_LIST} SET ${setClause} WHERE ${whereClause};`;
                return queryInterface.sequelize.query(sql, { transaction });
            });
            await Promise.all(updatePromises);

            // remove unused permissions for (to be) deleted collapses
            // material transfer, receipts, request and reverse/cancel
            const deleteUnusedPermissions = `
                DELETE FROM ${schemaName}.${USER_MASTER_PERMISSIONS} WHERE master_id IN (
                    'bad5c521-fd62-4050-a7ed-6b95101f967f',
                    '52cf2db4-9467-4d78-a023-42a5026c0180',
                    'cdb1160b-b040-4ca7-beb2-49ea99e522f5',
                    'b11b1234-5997-454e-894d-6df0fb6c9e47'
                );
                DELETE FROM ${schemaName}.${ROLE_MASTER_PERMISSIONS} WHERE master_id IN (
                    'bad5c521-fd62-4050-a7ed-6b95101f967f',
                    '52cf2db4-9467-4d78-a023-42a5026c0180',
                    'cdb1160b-b040-4ca7-beb2-49ea99e522f5',
                    'b11b1234-5997-454e-894d-6df0fb6c9e47'
                );
            `;
            await queryInterface.sequelize.query(deleteUnusedPermissions, {
                transaction
            });

            // remove unused collapses
            const deleteUnusedCollapseEntry = `
                DELETE FROM ${schemaName}.${ALL_MASTERS_LIST} WHERE id IN (
                    'bad5c521-fd62-4050-a7ed-6b95101f967f',
                    '52cf2db4-9467-4d78-a023-42a5026c0180',
                    'cdb1160b-b040-4ca7-beb2-49ea99e522f5',
                    'b11b1234-5997-454e-894d-6df0fb6c9e47'
                );
            `;
            await queryInterface.sequelize.query(deleteUnusedCollapseEntry, {
                transaction
            });

            // create permissoins for parent_id and grand_parent_ids where we have permissions for the child
            const generatedCreatePermissionQueries = generateCreatePermissionQueries(updates);
            const allCreatePermissionPromises = generatedCreatePermissionQueries.map(
                (query) => queryInterface.sequelize.query(query, { transaction })
            );
            await Promise.all(allCreatePermissionPromises);

            await transaction.commit();
        } catch (error) {
            console.log('error :', error);
            await transaction.rollback();
            throw new Error(
                "Error while executing all_masters_list updates",
                error
            );
        }
    },

    async down() {
        // NOTE Writing a down migration for this update would be extremely complex, therefore I have to skip it.
    }
};
