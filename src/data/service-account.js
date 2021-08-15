/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
let serviceAccount;
try {
  serviceAccount = require("../../env/service-account-file.json");
} catch (_e) {
  serviceAccount = {};
}

const getServiceAccount = () => serviceAccount;

module.exports = { getServiceAccount };
