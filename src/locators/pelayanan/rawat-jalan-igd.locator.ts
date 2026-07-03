export const RawatJalanIgdLocator = {
  page: {
    panelTitle: '.panel-title:has-text("Data Pemeriksaan Medis")',
    daftarTungguButton: "#changeLayoutBtn",
  },

  list: {
    wrapper: "#datatableMedisWrapper",
    searchForm: "#datatableMedisWrapper #form_search",
    searchInput: '#datatableMedisWrapper input[name="searchKey"]',
    ruanganSelect: "#datatableMedisWrapper #optionRuanganMedis",
    statusPeriksaSelect: "#datatableMedisWrapper #status_periksa",
    searchButton: '#datatableMedisWrapper button.btn-info:has-text("Cari")',
    resetButton: '#datatableMedisWrapper button.btn-warning:has-text("Reset")',
    table: "#datatableMedisWrapper table.datatable",
    tableBodyRow: "#datatableMedisWrapper table.datatable tbody tr",
  },

  daftarTunggu: {
    wrapper: "#datatableDaftarTungguWrapper",
    searchInput: '#datatableDaftarTungguWrapper input[name="searchKey"]',
    tableBodyRow: "#datatableDaftarTungguWrapper table tbody tr",
  },
} as const;
