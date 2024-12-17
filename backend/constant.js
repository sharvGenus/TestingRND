const VISIBLE_GAA_HIERARCHIES_LEVEL = ["id", "name", "integration_id", "code", "approval_status", "gaa_hierarchy_id", "remarks", "parent_id"];
const MANDETORY_GAA_HIERARCHIES_LEVEL = ["name", "code", "gaa_hierarchy_id", "approval_status"];
const SHEET_LEVEL_GAA_NAME = {
    gaa_level_entries: "ref_gaa_hierarchy_id",
    parent_id: "ref_parent_id",
    existing_entries: "existing_entries"
};
const VISIBLE_URBAN_HIERARCHIES_LEVEL = ["id", "name", "integration_id", "code", "approval_status", "urban_hierarchy_id", "remarks", "parent_id"];
const MANDETORY_URBAN_HIERARCHIES_LEVEL = ["name", "code", "urban_hierarchy_id", "approval_status"];
const SHEET_LEVEL_URBAN_NAME = {
    urban_level_entries: "ref_urban_hierarchy_id",
    parent_id: "ref_parent_id",
    existing_entries: "existing_entries"
};

const operations = {
    et: "=",
    net: "!=",
    gt: ">",
    lt: "<",
    gte: ">=",
    lte: "<="
};

module.exports = { VISIBLE_GAA_HIERARCHIES_LEVEL, SHEET_LEVEL_GAA_NAME, MANDETORY_GAA_HIERARCHIES_LEVEL, VISIBLE_URBAN_HIERARCHIES_LEVEL, MANDETORY_URBAN_HIERARCHIES_LEVEL, SHEET_LEVEL_URBAN_NAME, operations };