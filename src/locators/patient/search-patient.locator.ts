import { PatientCommonLocator } from "../shared/patient-common.locator";

export const SearchPatientLocator = {
  datatableWrapper: PatientCommonLocator.datatable.wrapper,
  limitPerPage: '#limitDatatableSection select[name="limitPerPage"]',
  searchForm: PatientCommonLocator.datatable.searchForm,
  typeRecord: '#form_search select[name="typeRecord"]',
  typeVerification: '#form_search select[name="typeVerification"]',
  generalConsent: '#form_search select[name="status_general_consent"]',
  birthDate: '#form_search input[name="birthDate"]',
  searchKey: "#form_search input[placeholder='Pencarian']",
  searchButton: '#form_search button.btn.btn-sm.btn-info[type="submit"]',
  resetButton: '#form_search button[type="reset"]',
  table: PatientCommonLocator.datatable.table,
  tableHeader: "#datatableWrapper table.datatable thead th",
  tableBody: "#datatableWrapper table.datatable tbody",
  tableRow: PatientCommonLocator.datatable.bodyRow,
  footerInfo: ".datatable-footer-infoTotal",
} as const;
