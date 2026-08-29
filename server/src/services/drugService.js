const drugRepository = require("../repositories/drugRepository");

const listDrugs = async ({ limit, offset, search }) =>
  drugRepository.listDrugs({ limit, offset, search });

const createDrug = async (payload) => drugRepository.create(payload);

module.exports = {
  listDrugs,
  createDrug,
};
