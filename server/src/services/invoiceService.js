const invoiceRepository = require("../repositories/invoiceRepository");

const listInvoices = async ({ limit, offset }) =>
  invoiceRepository.listInvoices({ limit, offset });

module.exports = {
  listInvoices,
};
