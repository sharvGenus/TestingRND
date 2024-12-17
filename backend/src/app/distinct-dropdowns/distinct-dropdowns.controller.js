const Users = require("../../database/operation/users");
const { getRefererWithoutHost } = require("../../utilities/common-utils");

const tables = {
    organizationType: "master_maker_lovs",
    users: "users",
    organizations: "organizations",
    countries: "countries",
    cities: "cities",
    states: "states",
    roles: "roles",
    projects: "projects",
    transaction_type_ranges: "transaction_type_ranges",
    organization_stores: "organization_stores",
    customer_departments: "customer_departments",
    customer_designations: "customer_designations",
    approver: "approver",
    master_maker_lovs: "master_maker_lovs",
    materials: "materials",
    master_makers: "master_makers",
    project_master_makers: "project_master_makers",
    project_master_maker_lovs: "project_master_maker_lovs",
    qa_master_makers: "qa_master_makers",
    qa_master_maker_lovs: "qa_master_maker_lovs",
    organization_store_locations: "organization_store_locations",
    gaaLevel: "gaa_hierarchies",
    networkLevel: "gaa_hierarchies",
    gaaEntry: "gaa_level_entries",
    networkEntry: "gaa_level_entries",
    devolutions: "devolutions",
    forms: "forms",
    ruralLevel: "urban_hierarchies",
    urbanLevel: "urban_hierarchies",
    ruralEntry: "urban_level_entries",
    urbanEntry: "urban_level_entries"
};

const getDistinctDropdowns = async (req) => {
    const { db } = new Users();
    const { tableName, searchString, getColumn, rowPerPage, pageNumber, customAccessor } = req.query;
    const referrer = await getRefererWithoutHost(req);
    let whereCondition = searchString?.length > 0 ? `and lower(${getColumn}:: text) like lower('%${searchString}%')` : "";

    let orderString = "";
    if (rowPerPage) {
        orderString += `limit ${rowPerPage} `;
    }
    if (pageNumber && pageNumber - 1 && rowPerPage) {
        orderString += `offset ${(pageNumber - 1) * rowPerPage}`;
    }

    if (tableName === "organizationType" && referrer === "/company-master/Company" && getColumn === "name") {
        whereCondition += " and master_id = '4b45adf7-fe15-48ca-9b5b-0fb9f7bf2253'";
    } else if (tableName === "organizationType" && referrer === "/contractor-master/Contractor" && getColumn === "name") {
        whereCondition += " and master_id = '4b45adf7-fe15-48ca-9b5b-0fb9f7bf2253'";
    } else if (tableName === "organizationType" && referrer === "/supplier-master/Supplier" && getColumn === "name") {
        whereCondition += " and master_id = '4b45adf7-fe15-48ca-9b5b-0fb9f7bf2253'";
    } else if (tableName === "organizationType" && referrer === "/customer-master/Customer" && getColumn === "name") {
        whereCondition += " and master_id = '4b45adf7-fe15-48ca-9b5b-0fb9f7bf2253'";
    } else if (tableName === "organizationType" && referrer === "/approver-master" && getColumn === "name") {
        whereCondition += " and master_id = '96a70303-09f6-4eb4-a20d-af37ebedaff8'";
    } else if (tableName === "organizationType") {
        whereCondition += " and master_id = 'b2cb6cc5-7fba-410c-8ac0-294df90829f4'";
    } else if (tableName === "roles") {
        whereCondition += ` and project_id = '${req.query.projectId}'`;
    } else if (tableName === "organizations" && referrer === "/company-master/Company") {
        whereCondition += " and organization_type_id = '420e7b13-25fd-4d23-9959-af1c07c7e94b' and parent_id is null";
    } else if (tableName === "organizations" && referrer === "/contractor-master/Contractor") {
        whereCondition += " and organization_type_id = 'decb6c57-6d85-4f83-9cc2-50e0630003df' and parent_id is null";
    } else if (tableName === "organizations" && referrer === "/supplier-master/Supplier") {
        whereCondition += " and organization_type_id = 'b442aa8c-92cb-420f-9e34-04764be59fc5' and parent_id is null";
    } else if (tableName === "organizations" && referrer === "/customer-master/Customer") {
        whereCondition += " and organization_type_id = 'e9206924-c5cb-454e-af1e-124d8179299a' and parent_id is null";
    } else if (tableName === "organizations" && (referrer === "/devolution-view" || referrer === "/devolution-approver")) {
        whereCondition += " and organization_type_id = 'e9206924-c5cb-454e-af1e-124d8179299a' and parent_id is null";
    } else if (tableName === "organizations" && referrer === "/company-location-master/Company") {
        whereCondition += " and organization_type_id = '420e7b13-25fd-4d23-9959-af1c07c7e94b'";
    } else if (tableName === "organizations" && referrer === "/contractor-location-master/Contractor") {
        whereCondition += " and organization_type_id = 'decb6c57-6d85-4f83-9cc2-50e0630003df'";
    } else if (tableName === "organization_stores" && referrer === "/contractor-store-master/Contractor") {
        whereCondition += " and organization_type = 'decb6c57-6d85-4f83-9cc2-50e0630003df'";
    } else if (tableName === "organization_stores" && referrer === "/company-store-master/Company") {
        whereCondition += " and organization_type = '420e7b13-25fd-4d23-9959-af1c07c7e94b'";
    } else if (tableName === "organization_stores" && (referrer === "/devolution-view" || referrer === "/devolution-approver")) {
        whereCondition += " and organization_type = 'e9206924-c5cb-454e-af1e-124d8179299a'";
    } else if (tableName === "master_maker_lovs" && referrer === "/material-master" && getColumn === "name") {
        whereCondition += " and master_id = '1d9dc597-5070-48c4-b135-9db6c503aed1'";
    } else if (tableName === "master_maker_lovs" && referrer === "/qa-master-lov" && customAccessor === "observationType") {
        whereCondition += " and master_id = '4a219c23-9458-410f-a56e-85d7eb7dc4fe'";
    } else if (tableName === "master_maker_lovs" && referrer === "/qa-master-lov" && customAccessor === "observationSeverity") {
        whereCondition += " and master_id = '0d6f899e-443d-46d6-a855-d609da7d2bd8'";
    } else if (tableName === "organizations" && referrer === "/contractor-store-master/Contractor") {
        whereCondition += " and organization_type_id = 'decb6c57-6d85-4f83-9cc2-50e0630003df'";
    } else if (tableName === "organizations" && referrer === "/company-store-master/Company") {
        whereCondition += " and organization_type_id = '420e7b13-25fd-4d23-9959-af1c07c7e94b'";
    } else if (tableName === "organization_stores" && referrer === "/customer-store-master/Customer") {
        whereCondition += " and organization_type = 'e9206924-c5cb-454e-af1e-124d8179299a'";
    } else if (tableName === "organizations" && referrer === "/customer-store-master/Customer") {
        whereCondition += " and organization_type_id = 'e9206924-c5cb-454e-af1e-124d8179299a'";
    } else if (tableName === "organization_stores" && referrer === "/supplier-repair-center-master/Supplier") {
        whereCondition += " and organization_type = 'b442aa8c-92cb-420f-9e34-04764be59fc5'";
    } else if (tableName === "organizations" && referrer === "/supplier-repair-center-master/Supplier") {
        whereCondition += " and organization_type_id = 'b442aa8c-92cb-420f-9e34-04764be59fc5'";
    } else if (tableName === "gaaLevel" || tableName === "networkLevel") {
        const level = tableName === "gaaLevel" ? "gaa" : "network";
        whereCondition += ` and project_id = '${req.query.projectId}' and level_type = '${level}'`;
    } else if (tableName === "gaaEntry" || tableName === "networkEntry") {
        whereCondition += ` and gaa_hierarchy_id = '${req.query.levelId}'`;
    } else if (tableName === "project_master_makers") {
        whereCondition += ` and project_id = '${req.query.projectId}'`;
    } else if (tableName === "project_master_maker_lovs") {
        whereCondition += ` and master_id = '${req.query.masterId}'`;
    } else if (tableName === "qa_master_makers") {
        whereCondition += ` and project_id = '${req.query.projectId}'`;
    } else if (tableName === "qa_master_maker_lovs") {
        whereCondition += ` and master_id = '${req.query.masterId}'`;
    } else if (tableName === "forms" && (referrer === "/devolution-view" || referrer === "/devolution-approver")) {
        whereCondition += " and form_type_id = '30ea8a65-ff5b-4bff-b1a1-892204e23669'";
    } else if (tableName === "ruralLevel" || tableName === "urbanLevel") {
        const level = tableName === "ruralLevel" ? "rural" : "urban";
        whereCondition += ` and project_id = '${req.query.projectId}' and level_type = '${level}'`;
    } else if (tableName === "ruralEntry" || tableName === "urbanEntry") {
        whereCondition += ` and urban_hierarchy_id = '${req.query.levelId}'`;
    }

    const query = `select distinct(${getColumn}) as name ${tableName === "organizations" && getColumn === "name" ? ", code" : ""} from ${tables[tableName]} where is_active = '1' and ${getColumn} is not null ${whereCondition} order by ${getColumn} asc ${orderString}`;
    let [rowData] = await db.sequelize.selectQuery(query);
    const countQuery = `select count(distinct ${getColumn}) from ${tables[tableName]} where is_active = '1' and ${getColumn} is not null ${whereCondition}`;
    const [countData] = await db.sequelize.selectQuery(countQuery);

    // for getting the module wise created by and updated by names.
    if (getColumn === "created_by" || getColumn === "updated_by") {
        const map = rowData.map((val) => `'${val.name}'`).join(",");
        const finalQuery = `select name as name from users where id in (${map})`;
        [rowData] = await db.sequelize.selectQuery(finalQuery);
    } else if (getColumn === "parent_id" && customAccessor === "parentName" && (referrer === "/gaa-level-entry-master" || referrer === "/network-level-entry-master")) {
        const map = rowData.map((val) => `'${val.name}'`).join(",");
        const finalQuery = `select name as name from ${tables[tableName]} where id in (${map})`;
        [rowData] = await db.sequelize.selectQuery(finalQuery);
    }
    
    const data = {
        rows: rowData,
        count: +countData[0].count
    };

    return { data };
};

module.exports = {
    getDistinctDropdowns
};
