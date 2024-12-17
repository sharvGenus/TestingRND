const router = require("express").Router();
const projectScopes = require("./project-scopes.controller");
const {
    validateProjectScopeSaveOrUpdate,
    validateProjectScopeExtensionSaveOrUpdate,
    validateProjectScopeSatSaveOrUpdate
} = require("./project-scopes.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post(
    "/project-scope/create",
    ensureAuthentications,
    validateProjectScopeSaveOrUpdate(),
    handleResponse.bind(this, projectScopes.createProjectScope)
);

router.get(
    "/project-scope/list",
    ensureAuthentications,
    handleResponse.bind(this, projectScopes.getProjectScopeList)
);

router.put(
    "/project-scope/update/:id",
    ensureAuthentications,
    validateProjectScopeSaveOrUpdate(),
    handleResponse.bind(this, projectScopes.updateProjectScope)
);

router.delete(
    "/project-scope/delete/:id",
    ensureAuthentications,
    handleResponse.bind(this, projectScopes.deleteProjectScope)
);

router.get(
    "/project-scope/history/:recordId",
    ensureAuthentications,
    handleResponse.bind(this, projectScopes.getProjectScopeHistory)
);

router.post(
    "/project-scope-extension/create",
    ensureAuthentications,
    validateProjectScopeExtensionSaveOrUpdate(),
    handleResponse.bind(this, projectScopes.createProjectScopeExtension)
);

router.get(
    "/project-scope-extension/list",
    ensureAuthentications,
    handleResponse.bind(this, projectScopes.getProjectScopeExtensionList)
);

router.put(
    "/project-scope-extension/update/:id",
    ensureAuthentications,
    validateProjectScopeExtensionSaveOrUpdate(),
    handleResponse.bind(this, projectScopes.updateProjectScopeExtension)
);

router.delete(
    "/project-scope-extension/delete/:id",
    ensureAuthentications,
    handleResponse.bind(this, projectScopes.deleteProjectScopeExtension)
);

router.get(
    "/project-scope-extension/history/:recordId",
    ensureAuthentications,
    handleResponse.bind(this, projectScopes.getProjectScopeExtensionHistory)
);

router.post(
    "/project-scope-sat/create",
    ensureAuthentications,
    validateProjectScopeSatSaveOrUpdate(),
    handleResponse.bind(this, projectScopes.createProjectScopeSat)
);

router.get(
    "/project-scope-sat/list",
    ensureAuthentications,
    handleResponse.bind(this, projectScopes.getProjectScopeSatList)
);

router.put(
    "/project-scope-sat/update/:id",
    ensureAuthentications,
    validateProjectScopeSatSaveOrUpdate(),
    handleResponse.bind(this, projectScopes.updateProjectScopeSat)
);

router.delete(
    "/project-scope-sat/delete/:id",
    ensureAuthentications,
    handleResponse.bind(this, projectScopes.deleteProjectScopeSat)
);

router.get(
    "/project-scope-sat/history/:recordId",
    ensureAuthentications,
    handleResponse.bind(this, projectScopes.getProjectScopeSatHistory)
);

module.exports = router;
