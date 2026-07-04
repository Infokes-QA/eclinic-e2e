export const PatientCommonLocator = {
  pendaftaranPanelTitle: '.panel-title:has-text("Pendaftaran")',
  tambahButton: "#button_create",
  formGroupByLabel: 'div.form-group:has(label:has-text("{label}"))',
  linkAnchor: "a",
  panelKiri: {
    container: ".panel-kiri",
    heading: '.panel-kiri .panel-heading:has-text("Data Pasien")',
    table: ".panel-kiri table.table",
    expandLink: '.panel-kiri a.pointer:has-text("Lihat Selengkapnya")',
  },
  datatable: {
    wrapper: "#datatableWrapper",
    searchForm: "#form_search",
    table: "#datatableWrapper table.datatable",
    bodyRow: "#datatableWrapper table.datatable tbody tr",
  },
} as const;
