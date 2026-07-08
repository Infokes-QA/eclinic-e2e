import { Locator, Page } from "@playwright/test";

import { CreatePatientData } from "../../../data/patient/create-patient.data";
import { PatientFixture } from "../../../fixtures/patient.fixture";
import { CreatePatientLocator } from "../../../locators/patient/create-patient.locator";
import {
  CreatedPatientSnapshot,
  PatientAlamatLengkapInput,
  PatientDataLainnyaInput,
  PatientFormInput,
  PatientGender,
  PatientGolonganDarah,
  PatientWargaNegara,
} from "../../../types/patient.type";
import { BasePage } from "../../base/BasePage";
import { NavbarComponent } from "../../components/NavbarComponent";
import { NotifyComponent } from "../../components/NotifyComponent";
import { SweetAlertComponent } from "../../components/SweetAlertComponent";
import { CreatePatientAddressSection } from "./CreatePatientAddressSection";
import { CreatePatientModalSection } from "./CreatePatientModalSection";
import { CreatePatientPanelSection } from "./CreatePatientPanelSection";

export class CreatePatientPage extends BasePage {
  readonly panelTitle: Locator;
  readonly fiturTundaButton: Locator;
  readonly tambahButton: Locator;
  readonly daftarLaboratoriumButton: Locator;
  readonly daftarRencanaKontrolButton: Locator;
  readonly printButton: Locator;
  readonly exportExcelButton: Locator;
  readonly btnNewCreatePatient: Locator;

  readonly navbar: NavbarComponent;

  private readonly address: CreatePatientAddressSection;
  private readonly modal: CreatePatientModalSection;
  private readonly panel: CreatePatientPanelSection;

  constructor(page: Page) {
    super(page);

    this.panelTitle = page.locator(CreatePatientLocator.page.panelTitle);
    this.fiturTundaButton = page.locator(CreatePatientLocator.actionButtonMenu.fiturTunda);
    this.tambahButton = page.locator(CreatePatientLocator.actionButtonMenu.tambah);
    this.daftarLaboratoriumButton = page.locator(
      CreatePatientLocator.actionButtonMenu.daftarLaboratorium,
    );
    this.daftarRencanaKontrolButton = page.locator(
      CreatePatientLocator.actionButtonMenu.daftarRencanaKontrol,
    );
    this.printButton = page.locator(CreatePatientLocator.actionButtonMenu.print);
    this.exportExcelButton = page.locator(CreatePatientLocator.actionButtonMenu.exportExcel);
    this.btnNewCreatePatient = page.locator(CreatePatientLocator.actionButton.btnNewCreatePatient);

    this.navbar = new NavbarComponent(page);
    const notify = new NotifyComponent(page);
    const sweetAlert = new SweetAlertComponent(page);

    this.address = new CreatePatientAddressSection(page);
    this.modal = new CreatePatientModalSection(page, this.address, notify, sweetAlert);
    this.panel = new CreatePatientPanelSection(page);
  }

  async openFromNavbar(menu: string, submenu: string): Promise<void> {
    const { menu: expectedMenu, submenu: expectedSubmenu } =
      PatientFixture.createPatientNavigation;

    if (menu !== expectedMenu || submenu !== expectedSubmenu) {
      throw new Error(
        `Menu '${menu}' dengan submenu '${submenu}' belum didukung oleh CreatePatientPage.`,
      );
    }

    await this.navbar.openCreatePasien();
  }

  async verifyCreatePatientPageDisplayed(): Promise<void> {
    await this.expectUrlMatches(CreatePatientData.url.createPatientPage);
    await this.expectVisible(this.panelTitle);
    await this.expectVisible(this.tambahButton);
    await this.expectVisible(this.daftarRencanaKontrolButton);
    await this.expectVisible(this.printButton);
    await this.expectVisible(this.exportExcelButton);
  }

  async openCreatePatientModal(): Promise<void> {
    await this.click(this.tambahButton);
    await this.expectVisible(this.btnNewCreatePatient);
    await this.click(this.btnNewCreatePatient);
    await this.verifyCreatePatientModalDisplayed();
  }

  async verifyCreatePatientModalDisplayed(): Promise<void> {
    return this.modal.verifyCreatePatientModalDisplayed();
  }

  async setVerifiedDataComplete(isComplete: boolean): Promise<void> {
    return this.modal.setVerifiedDataComplete(isComplete);
  }

  async setVerifiedCheckboxState(state: "dicentang" | "tidak dicentang"): Promise<void> {
    return this.modal.setVerifiedCheckboxState(state);
  }

  async verifyRingkasFormMode(): Promise<void> {
    return this.modal.verifyRingkasFormMode();
  }

  async verifyLengkapFormMode(): Promise<void> {
    return this.modal.verifyLengkapFormMode();
  }

  async selectInsuranceByLabel(insuranceName: string): Promise<void> {
    return this.modal.selectInsuranceByLabel(insuranceName);
  }

  async selectWargaNegara(wargaNegara: PatientWargaNegara): Promise<void> {
    return this.modal.selectWargaNegara(wargaNegara);
  }

  async ensureWargaNegaraIndonesia(): Promise<void> {
    return this.modal.ensureWargaNegaraIndonesia();
  }

  async selectGolonganDarah(golonganDarah: PatientGolonganDarah): Promise<void> {
    return this.modal.selectGolonganDarah(golonganDarah);
  }

  async fillNoKK(noKK: string): Promise<void> {
    return this.modal.fillNoKK(noKK);
  }

  async fillNik(nik: string): Promise<void> {
    return this.modal.fillNik(nik);
  }

  async fillNama(nama: string): Promise<void> {
    return this.modal.fillNama(nama);
  }

  async fillPhoneNumber(phoneNumber: string): Promise<void> {
    return this.modal.fillPhoneNumber(phoneNumber);
  }

  async fillTanggalLahir(tanggalLahir: string): Promise<void> {
    return this.modal.fillTanggalLahir(tanggalLahir);
  }

  async selectJenisKelamin(gender: PatientGender): Promise<void> {
    return this.modal.selectJenisKelamin(gender);
  }

  async fillTempatLahir(tempatLahir: string): Promise<void> {
    return this.modal.fillTempatLahir(tempatLahir);
  }

  async fillAlamatDomisili(alamatDomisili: string): Promise<void> {
    return this.modal.fillAlamatDomisili(alamatDomisili);
  }

  async expandInputAlamatLengkapIfNeeded(): Promise<void> {
    return this.address.expandInputAlamatLengkapIfNeeded();
  }

  async expandInputDataLainnyaIfNeeded(): Promise<void> {
    return this.address.expandInputDataLainnyaIfNeeded();
  }

  async fillRt(rt: string): Promise<void> {
    return this.address.fillRt(rt);
  }

  async fillRw(rw: string): Promise<void> {
    return this.address.fillRw(rw);
  }

  async fillPropinsi(propinsi?: string): Promise<string> {
    return this.address.fillPropinsi(propinsi);
  }

  async fillKotaKab(kotaKab?: string): Promise<string> {
    return this.address.fillKotaKab(kotaKab);
  }

  async fillKecamatan(kecamatan?: string): Promise<string> {
    return this.address.fillKecamatan(kecamatan);
  }

  async fillKelurahanDesa(kelurahanDesa?: string): Promise<string> {
    return this.address.fillKelurahanDesa(kelurahanDesa);
  }

  async fillAlamatLengkap(input: PatientAlamatLengkapInput): Promise<PatientAlamatLengkapInput> {
    return this.address.fillAlamatLengkap(input);
  }

  async fillPekerjaan(pekerjaan?: string): Promise<string> {
    return this.address.fillPekerjaan(pekerjaan);
  }

  async selectAgama(agama: PatientDataLainnyaInput["agama"]): Promise<void> {
    return this.address.selectAgama(agama);
  }

  async selectPendidikan(pendidikan: PatientDataLainnyaInput["pendidikan"]): Promise<void> {
    return this.address.selectPendidikan(pendidikan);
  }

  async selectStatusPerkawinan(
    statusPerkawinan: PatientDataLainnyaInput["statusPerkawinan"],
  ): Promise<void> {
    return this.address.selectStatusPerkawinan(statusPerkawinan);
  }

  async fillEmail(email: string): Promise<void> {
    return this.address.fillEmail(email);
  }

  async fillNamaAyah(namaAyah: string): Promise<void> {
    return this.address.fillNamaAyah(namaAyah);
  }

  async fillNamaIbu(namaIbu: string): Promise<void> {
    return this.address.fillNamaIbu(namaIbu);
  }

  async fillHubunganKeluarga(hubunganKeluarga: string): Promise<void> {
    return this.address.fillHubunganKeluarga(hubunganKeluarga);
  }

  async fillDataLainnya(input: PatientDataLainnyaInput): Promise<PatientDataLainnyaInput> {
    return this.address.fillDataLainnya(input);
  }

  async fillPatientForm(input: PatientFormInput): Promise<PatientFormInput> {
    return this.modal.fillPatientForm(input);
  }

  async fillPatientFormWithFakeDataRingkas(): Promise<PatientFormInput> {
    return this.modal.fillPatientFormWithFakeDataRingkas();
  }

  async fillPatientFormWithFakeDataLengkap(): Promise<PatientFormInput> {
    return this.modal.fillPatientFormWithFakeDataLengkap();
  }

  async fillPatientFormWithConditionalData(jenisData: string): Promise<PatientFormInput> {
    return this.modal.fillPatientFormWithConditionalData(jenisData);
  }

  async clickSavePatientButton(): Promise<void> {
    return this.modal.clickSavePatientButton();
  }

  async verifyPatientFormFilled(input: PatientFormInput): Promise<void> {
    return this.modal.verifyPatientFormFilled(input);
  }

  async captureSaveAlertScreenshot(): Promise<Buffer> {
    return this.modal.captureSaveAlertScreenshot();
  }

  async getSaveAlertMessage(): Promise<string> {
    return this.modal.getSaveAlertMessage();
  }

  async verifySaveAlertSuccess(): Promise<void> {
    return this.modal.verifySaveAlertSuccess();
  }

  async verifyOnCreateRegistrationPage(): Promise<void> {
    return this.panel.verifyOnCreateRegistrationPage();
  }

  async getPanelKiriCellValue(label: string): Promise<string> {
    return this.panel.getPanelKiriCellValue(label);
  }

  async expandPanelKiriDetails(): Promise<void> {
    return this.panel.expandPanelKiriDetails();
  }

  async verifyPatientPanelKiri(input: PatientFormInput): Promise<void> {
    return this.panel.verifyPatientPanelKiri(input);
  }

  async verifyPatientSavedSuccess(
    input: PatientFormInput,
    snapshot: CreatedPatientSnapshot,
  ): Promise<void> {
    return this.panel.verifyPatientSavedSuccess(input, snapshot);
  }

  async captureCreatedPatientSnapshot(input: PatientFormInput): Promise<CreatedPatientSnapshot> {
    return this.panel.captureCreatedPatientSnapshot(input);
  }
}
