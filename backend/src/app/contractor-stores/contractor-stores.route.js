const router = require("express").Router();
const contractorStore = require("./contractor-stores.controller");
const { validateContractorStoresSaveOrUpdate } = require("./contractor-stores.request");
const { handleResponse } = require("../../utilities/common-utils");

router.post("/contractor-stores/create", validateContractorStoresSaveOrUpdate(), handleResponse.bind(this, contractorStore.createContractorStores));
router.put("/contractor-stores/update/:id", validateContractorStoresSaveOrUpdate(), handleResponse.bind(this, contractorStore.updateContractorStores));
router.get("/contractor-stores/details/:id", handleResponse.bind(this, contractorStore.getContractorStoresDetails));
router.get("/contractor-stores/list", handleResponse.bind(this, contractorStore.getAllContractorStores));
router.delete("/contractor-stores/delete/:id", handleResponse.bind(this, contractorStore.deleteContractorStores));

module.exports = router;