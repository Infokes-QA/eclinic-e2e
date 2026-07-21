import { expect, Locator, Page } from "@playwright/test";

import { ENV } from "../../config/env";
import { PengkajianAwalData } from "../../data/pelayanan/pengkajian-awal.data";
import { PengkajianFormDefaults } from "../../fixtures/patient.fixture";
import { formatNoErmForDisplay } from "../../helpers/patient-display.helper";
import { RandomHelper } from "../../helpers/random.helper";
import { PengkajianAwalLocator } from "../../locators/pelayanan/pengkajian-awal.locator";
import { RegistrationSnapshot } from "../../types/patient.type";
import { PengkajianFormInput } from "../../types/pengkajian.type";
import { BasePage } from "../base/BasePage";
import { NotifyComponent } from "../components/NotifyComponent";

export class PengkajianAwalPage extends BasePage {
  readonly pageTitle: Locator;
  readonly panelKiri: Locator;
  readonly panelPasienTable: Locator;
  readonly formWrapper: Locator;
  readonly keluhanUtamaInput: Locator;
  readonly anamnesaInput: Locator;
  readonly lamaSakitInputs: Locator;
  readonly simpanButton: Locator;
  readonly simpanDanMulaiDokterButton: Locator;
  readonly cpptLink: Locator;
  readonly kunjunganRows: Locator;
  readonly notify: NotifyComponent;
  private lastSaveNotifyMessage?: string;

  constructor(page: Page) {
    super(page);

    const formScope = page.locator(PengkajianAwalLocator.form.wrapper);
    this.pageTitle = page.locator(PengkajianAwalLocator.page.title);
    this.panelKiri = page.locator(PengkajianAwalLocator.page.panelKiri);
    this.panelPasienTable = page.locator(PengkajianAwalLocator.panelPasien.table);
    this.formWrapper = formScope;
    this.keluhanUtamaInput = formScope.locator(PengkajianAwalLocator.form.keluhanUtama);
    this.anamnesaInput = formScope.locator(
      'div.form-group.row:has(label:has-text("Keluhan Tambahan / Anamnesa")) textarea',
    );
    this.lamaSakitInputs = formScope.locator(
      `${PengkajianAwalLocator.form.lamaSakitGroup} input.input-sm`,
    );
    this.simpanButton = page.getByRole("button", {
      name: PengkajianAwalData.button.simpan,
      exact: true,
    });
    this.simpanDanMulaiDokterButton = page.getByRole("button", {
      name: PengkajianAwalData.button.simpanDanMulaiDokter,
      exact: true,
    });
    this.cpptLink = page.locator(PengkajianAwalLocator.rekamMedis.cpptLink);
    this.kunjunganRows = page.locator(PengkajianAwalLocator.rekamMedis.kunjunganTable);
    this.notify = new NotifyComponent(page);
  }

  async verifyOnPemeriksaanPage(): Promise<void> {
    await this.expectVisible(this.pageTitle);
    await expect(this.pageTitle).toContainText(PengkajianAwalData.page.title);
    await this.expectVisible(this.panelKiri);
  }

  async isOnPemeriksaanPage(): Promise<boolean> {
    return this.pageTitle.isVisible().catch(() => false);
  }

  async verifyPanelDataPasien(snapshot: RegistrationSnapshot): Promise<void> {
    await this.expectVisible(this.panelPasienTable);

    const panelText = ((await this.panelPasienTable.innerText()) ?? "")
      .replace(/\s+/g, " ")
      .trim();

    expect(panelText.toUpperCase()).toContain(snapshot.nama.toUpperCase());
    expect(panelText).toContain(snapshot.nik);
    expect(panelText.toUpperCase()).toContain(snapshot.ruangan.toUpperCase());
    expect(panelText).toContain(formatNoErmForDisplay(snapshot.noRm));
  }

  async clickPengkajianAwal(): Promise<void> {
    await this.dismissOptionalModals();

    await expect(
      this.page.getByText(PengkajianAwalData.page.landingMessage, { exact: true }),
    ).toBeVisible({ timeout: ENV.TIMEOUT });

    const pengkajianButton = this.page.getByRole("button", {
      name: PengkajianAwalData.button.pengkajianAwal,
      exact: true,
    });

    await expect(pengkajianButton).toBeVisible({ timeout: ENV.TIMEOUT });
    await pengkajianButton.click();
    await this.verifyOnPengkajianForm();
  }

  async verifyOnPengkajianForm(): Promise<void> {
    await expect(
      this.page.locator(PengkajianAwalLocator.page.panelPengkajianHeading),
    ).toBeVisible({ timeout: ENV.TIMEOUT });
    await this.expectVisible(this.formWrapper);
    await this.expectVisible(this.keluhanUtamaInput);
  }

  async isOnPengkajianForm(): Promise<boolean> {
    return this.keluhanUtamaInput.isVisible().catch(() => false);
  }

  async ensurePengkajianFormReady(): Promise<void> {
    if (await this.isOnPengkajianForm()) {
      return;
    }

    await this.clickPengkajianAwal();
  }

  async fillPengkajianFormLengkap(): Promise<PengkajianFormInput> {
    const uniqueSuffix = RandomHelper.generatePhoneNumber().slice(-6);
    const input: PengkajianFormInput = {
      keluhanUtama: `${PengkajianFormDefaults.keluhanPrefix} ${uniqueSuffix}`,
      anamnesa: `${PengkajianFormDefaults.anamnesaPrefix} ${uniqueSuffix}`,
      lamaSakitThn: PengkajianFormDefaults.lamaSakitThn,
      lamaSakitBln: PengkajianFormDefaults.lamaSakitBln,
      lamaSakitHr: PengkajianFormDefaults.lamaSakitHr,
      sistole: PengkajianFormDefaults.sistole,
      diastole: PengkajianFormDefaults.diastole,
    };

    await this.fillAsistenPerawatBidan();
    await this.fillTopSection(input);
    await this.expandSkriningAwal();
    await this.fillSkriningAwalDetailSection();
    await this.fillRiwayatPenyakit(uniqueSuffix);
    await this.fillAlergiSection();
    await this.fillVitalSigns();
    await this.fillPemeriksaanFisikSection(uniqueSuffix);
    await this.fillRiwayatPengobatanSection();
    await this.fillDiagnosisKeperawatanSection(uniqueSuffix);
    await this.ensureFormActionButtonsVisible();

    return input;
  }

  async ensureFormActionButtonsVisible(): Promise<void> {
    await expect(
      this.page.locator(PengkajianAwalLocator.page.panelPengkajianHeading),
    ).toBeVisible({ timeout: ENV.TIMEOUT });

    await this.simpanButton.scrollIntoViewIfNeeded();
    await expect(this.simpanButton).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  async dismissOptionalModals(): Promise<void> {
    const skriningLansia = this.page.locator(PengkajianAwalLocator.modal.skriningLansia);

    if (await skriningLansia.isVisible({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT }).catch(() => false)) {
      await this.page
        .locator(PengkajianAwalLocator.modal.skriningLansiaLakukanNanti)
        .click({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT })
        .catch(() => undefined);
    }

    const antrol = this.page.locator(PengkajianAwalLocator.modal.antrol);

    if (await antrol.isVisible({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT }).catch(() => false)) {
      await this.page
        .locator(PengkajianAwalLocator.modal.antrolLanjutkan)
        .click({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT })
        .catch(() => undefined);
    }
  }

  async clickSave(): Promise<void> {
    await this.dismissOptionalModals();
    await this.ensureFormActionButtonsVisible();

    const successWatcher = this.notify.waitForMessageMatching(
      PengkajianAwalData.alert.saveSuccessPattern,
      ENV.TIMEOUT,
    );

    await this.click(this.simpanButton);

    this.lastSaveNotifyMessage = await successWatcher;
  }

  async clickSaveAndStartDoctorExam(): Promise<void> {
    await this.dismissOptionalModals();
    await this.notify.dismissIfVisible();

    const clicked = await this.clickDoctorExamButton();

    if (!clicked) {
      throw new Error(
        "Tombol Selesaikan Pelayanan tidak ditemukan setelah simpan pengkajian awal.",
      );
    }
  }

  private async clickDoctorExamButton(): Promise<boolean> {
    if (await this.simpanDanMulaiDokterButton.isVisible({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT }).catch(() => false)) {
      await this.simpanDanMulaiDokterButton.scrollIntoViewIfNeeded();
      await this.click(this.simpanDanMulaiDokterButton);
      return true;
    }

    const landingButton = this.page.getByRole("button", {
      name: PengkajianAwalData.button.mulaiPemeriksaanDokter,
      exact: true,
    });

    if (await landingButton.isVisible({ timeout: ENV.TIMEOUT }).catch(() => false)) {
      await this.click(landingButton);
      return true;
    }

    await this.ensureFormActionButtonsVisible();
    await this.click(this.simpanDanMulaiDokterButton);
    return true;
  }

  async verifySaveSuccess(): Promise<void> {
    const message =
      this.lastSaveNotifyMessage ??
      (await this.notify.waitForMessageMatching(
        PengkajianAwalData.alert.saveSuccessPattern,
        ENV.TIMEOUT,
      ));

    expect(message).toMatch(PengkajianAwalData.alert.saveSuccessPattern);
    await this.notify.dismissIfVisible();
    this.lastSaveNotifyMessage = undefined;
  }

  async verifyAnamnesaOnRekamMedisKunjungan(input: PengkajianFormInput): Promise<void> {
    await this.expandRekamMedisKunjunganPanel();

    const latestKunjunganRow = this.kunjunganRows.first();
    await expect(latestKunjunganRow).toBeVisible({ timeout: ENV.TIMEOUT });
    await latestKunjunganRow.click();
    await expect(this.page.locator(PengkajianAwalLocator.modal.riwayatPelayanan.wrapper)).toBeVisible({
      timeout: ENV.TIMEOUT,
    });

    await expect(this.anamnesaInput).toHaveValue(input.anamnesa, { timeout: ENV.TIMEOUT });
    await expect(this.keluhanUtamaInput).toHaveValue(input.keluhanUtama, {
      timeout: ENV.TIMEOUT,
    });

    await this.closeRiwayatPelayananModalIfVisible();
  }

  async verifyAnamnesaOnCppt(input: PengkajianFormInput): Promise<void> {
    await this.closeRiwayatPelayananModalIfVisible();
    await this.expandRekamMedisKunjunganPanel();
    await expect(this.cpptLink).toBeVisible({ timeout: ENV.TIMEOUT });

    const cpptPagePromise = this.page.context().waitForEvent("page");
    await this.cpptLink.click();
    const cpptPage = await cpptPagePromise;

    await cpptPage.waitForLoadState("domcontentloaded");

    const cpptText = ((await cpptPage.locator("body").innerText()) ?? "")
      .replace(/\s+/g, " ")
      .trim();

    expect(cpptText).toContain(input.anamnesa);

    await cpptPage.close();
  }

  private async expandRekamMedisKunjunganPanel(): Promise<void> {
    const { rekamMedis } = PengkajianAwalLocator;
    const panel = this.page.locator(rekamMedis.kunjunganPanel);
    const body = panel.locator(".panel-body");

    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toBeVisible({ timeout: ENV.TIMEOUT });

    if (!(await body.isVisible().catch(() => false))) {
      await this.page.locator(rekamMedis.kunjunganPanelHeading).click();
    }

    await expect(body).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  private async closeRiwayatPelayananModalIfVisible(): Promise<void> {
    const { riwayatPelayanan } = PengkajianAwalLocator.modal;
    const activeModal = this.page.locator("#modal.fade.in, .modal.fade.in").last();
    const modalCloseButton = this.page.locator(`#modal ${riwayatPelayanan.tutup}, ${riwayatPelayanan.tutup}`).last();

    if (
      !(await activeModal.isVisible({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT }).catch(() => false)) &&
      !(await modalCloseButton.isVisible({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT }).catch(() => false))
    ) {
      return;
    }

    if (await modalCloseButton.isVisible({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT }).catch(() => false)) {
      await modalCloseButton.scrollIntoViewIfNeeded();
      await modalCloseButton.click({ force: true });
    } else {
      const headerCloseButton = this.page.locator("#modal button.close, .modal.fade.in button.close, .modal.fade.in .close").last();

      if (await headerCloseButton.isVisible({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT }).catch(() => false)) {
        await headerCloseButton.click({ force: true });
      } else {
        await this.page.keyboard.press("Escape");
      }
    }

    if (await activeModal.isVisible({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT }).catch(() => false)) {
      await this.page.evaluate(() => {
        const appWindow = window as typeof window & { closemodal?: () => void };

        appWindow.closemodal?.();
      });
    }

    await expect(activeModal).toBeHidden({ timeout: ENV.TIMEOUT });
    await expect(this.page.locator(".modal-backdrop")).toBeHidden({ timeout: ENV.TIMEOUT });
  }

  private async fillAsistenPerawatBidan(): Promise<void> {
    const { asistenPerawatBidan } = PengkajianAwalLocator.form;
    const multiselectRoot = this.formWrapper.locator(asistenPerawatBidan.multiselect).first();
    const tags = multiselectRoot.locator(asistenPerawatBidan.tags);

    await multiselectRoot.scrollIntoViewIfNeeded();
    await expect(multiselectRoot).toBeVisible({ timeout: ENV.TIMEOUT });
    await expect(tags).toBeVisible({ timeout: ENV.TIMEOUT });
    await tags.click();

    for (let index = 0; index < 3; index += 1) {
      await this.page.keyboard.press("Space");
    }

    const dropdown = multiselectRoot.locator(`${asistenPerawatBidan.contentWrapper}:visible`);
    await expect(dropdown).toBeVisible({ timeout: ENV.TIMEOUT });

    const options = dropdown
      .locator(`${asistenPerawatBidan.optionItem} span.multiselect__option:visible`)
      .filter({ hasNotText: /Data kosong|Pencarian tidak ditemukan/i });

    await expect(options.first()).toBeVisible({ timeout: ENV.TIMEOUT });

    const count = await options.count();
    const randomOption = options.nth(RandomHelper.pickRandomIndex(count));

    await randomOption.scrollIntoViewIfNeeded();
    await randomOption.click();
  }

  private async fillTopSection(input: PengkajianFormInput): Promise<void> {
    await this.fill(this.keluhanUtamaInput, input.keluhanUtama);
    await this.fill(this.anamnesaInput, input.anamnesa);
    await this.fill(this.lamaSakitInputs.nth(0), input.lamaSakitThn);
    await this.fill(this.lamaSakitInputs.nth(1), input.lamaSakitBln);
    await this.fill(this.lamaSakitInputs.nth(2), input.lamaSakitHr);
  }

  private async expandSkriningAwal(): Promise<void> {
    const wrapper = this.page.locator(PengkajianAwalLocator.form.skriningAwal.wrapper);
    const body = this.page.locator(PengkajianAwalLocator.form.skriningAwal.body).first();
    const accordionBody = this.page.locator(PengkajianAwalLocator.form.skriningAwal.accordionBody);

    if (!(await accordionBody.isVisible().catch(() => false))) {
      const toggle = wrapper.getByText("Tampilkan", { exact: true }).first();
      const heading = wrapper.locator(".panel-heading").first();

      await heading.scrollIntoViewIfNeeded();

      if (await toggle.isVisible({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT }).catch(() => false)) {
        await toggle.click();
      } else {
        await heading.click();
      }
    }

    await expect(body).toBeVisible({ timeout: ENV.TIMEOUT });

    if (!(await accordionBody.isVisible().catch(() => false))) {
      await this.page.locator(PengkajianAwalLocator.form.skriningAwal.accordionHeader).click();
    }

    await expect(accordionBody).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  private async fillSkriningAwalDetailSection(): Promise<void> {
    const scope = this.page.locator(PengkajianAwalLocator.form.skriningAwal.accordionBody);
    const { skriningAwalDetail } = PengkajianAwalLocator.form;

    await expect(scope.getByText("Skrining Fungsional Pasien")).toBeVisible({
      timeout: ENV.TIMEOUT,
    });

    await this.checkRadioByLabel(scope, "Disabilitas", "0");
    await this.fill(scope.locator(skriningAwalDetail.ambulasiInput), PengkajianFormDefaults.ambulasi);
    await this.checkRadioByLabel(scope, "Hambatan Komunikasi", "0");

    await this.checkRadioByLabel(scope, "Tidak Seimbang/ Sempoyongan/ Limbung", "0");
    await this.checkRadioByLabel(
      scope,
      "Jalan dengan menggunakan alat bantu (Kruk, Tripod, Kursi Roda, Orang Lain)",
      "0",
    );
    await this.checkRadioByLabel(
      scope,
      "Menopang saat duduk : Tampak memegang pinggiran kursi atau meja/ benda lain sebagai penopang saat akan duduk",
      "0",
    );

    await this.fill(scope.locator(skriningAwalDetail.skalaNyeriRange), PengkajianFormDefaults.skalaNyeri);
    await this.fill(scope.locator(skriningAwalDetail.kapanNyeriInput), PengkajianFormDefaults.kapanNyeriBerulang);
    await this.fill(scope.locator(skriningAwalDetail.sifatNyeriInput), PengkajianFormDefaults.sifatNyeri);

    await this.checkRadioInGroup(
      scope,
      "Apakah pasien mengalami penurunan berat badan yang tidak diinginkan dalam kurun waktu 6 bulan terakhir ?",
      "0",
    );
    await this.checkRadioInGroup(
      scope,
      "Apakah asupan makan berkurang karena tidak nafsu makan ?",
      "0",
    );
    await this.checkRadioByLabel(scope, "Pasien Dengan Diagnosis Khusus ?", "0");
  }

  private async checkRadioByLabel(
    scope: Locator,
    labelText: string,
    value: string,
  ): Promise<void> {
    const group = scope.locator(`div.form-group:has(label:has-text("${labelText}"))`);
    const radio = scope
      .locator(`div.form-group:has(label:has-text("${labelText}")) input[type="radio"][value="${value}"]`)
      .first();

    await group.scrollIntoViewIfNeeded();
    await expect(radio).toBeAttached({ timeout: ENV.TIMEOUT });

    if (!(await radio.isChecked())) {
      await this.checkHiddenRadio(radio);
    }

    await expect(radio).toBeChecked();
  }

  private async checkRadioInGroup(
    scope: Locator,
    labelText: string,
    value: string,
  ): Promise<void> {
    const group = scope.locator(`div.form-group:has(label:has-text("${labelText}"))`);
    const radio = group.locator(`input[type="radio"][value="${value}"]`).first();

    await group.scrollIntoViewIfNeeded();
    await expect(radio).toBeAttached({ timeout: ENV.TIMEOUT });

    if (!(await radio.isChecked())) {
      await this.checkHiddenRadio(radio);
    }

    await expect(radio).toBeChecked();
  }

  private async checkHiddenRadio(radio: Locator): Promise<void> {
    await radio.evaluate((element) => {
      const input = element as HTMLInputElement;

      input.checked = true;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  private async expandAccordionSection(headerSelector: string, bodySelector: string): Promise<void> {
    const header = this.page.locator(headerSelector);
    const body = this.page.locator(bodySelector);
    const isExpanded = await body
      .evaluate((element) => element.classList.contains("in"))
      .catch(() => false);

    if (!isExpanded) {
      await header.scrollIntoViewIfNeeded();
      await header.click();
    }

    await expect(body).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  private async fillRiwayatPenyakit(uniqueSuffix: string): Promise<void> {
    const { riwayatPenyakit } = PengkajianAwalLocator.form;
    const scope = this.formWrapper.locator(riwayatPenyakit.section);
    const prefix = PengkajianFormDefaults.riwayatPenyakitPrefix;

    await expect(scope).toBeVisible({ timeout: ENV.TIMEOUT });
    await this.fill(scope.locator(riwayatPenyakit.rps), `${prefix} RPS ${uniqueSuffix}`);
    await this.fill(scope.locator(riwayatPenyakit.rpd), `${prefix} RPD ${uniqueSuffix}`);
    await this.fill(scope.locator(riwayatPenyakit.rpk), `${prefix} RPK ${uniqueSuffix}`);
  }

  private async fillAlergiSection(): Promise<void> {
    const { alergi } = PengkajianAwalLocator.form;
    const scope = this.formWrapper.locator(alergi.section);

    await expect(scope).toBeVisible({ timeout: ENV.TIMEOUT });

    const tidakAdaCheckbox = scope.locator(alergi.tidakAdaCheckbox);

    if (!(await tidakAdaCheckbox.isChecked())) {
      await this.check(tidakAdaCheckbox);
    }

    if (await tidakAdaCheckbox.isChecked()) {
      return;
    }

    await this.selectMultiselectBySpaces(scope, alergi.obatInput);
    await this.selectMultiselectBySpaces(scope, alergi.makananInput);
    await this.selectMultiselectBySpaces(scope, alergi.udaraInput);
    await this.fill(scope.locator(alergi.lainnya), PengkajianFormDefaults.alergiLainnya);
  }

  private async fillVitalSigns(): Promise<void> {
    const { vitalSign } = PengkajianAwalLocator.form;
    const scope = this.formWrapper.locator(vitalSign.section);

    await expect(scope).toBeVisible({ timeout: ENV.TIMEOUT });

    await this.selectOption(
      scope.locator(vitalSign.kesadaran),
      PengkajianFormDefaults.kesadaran,
    );
    await this.fill(
      scope.locator(`${vitalSign.sistoleGroup} input.input-sm`),
      PengkajianFormDefaults.sistole,
    );
    await this.fill(
      scope.locator(`${vitalSign.diastoleGroup} input.input-sm`),
      PengkajianFormDefaults.diastole,
    );
    await this.fill(
      scope.locator(`${vitalSign.tinggiBadanGroup} input.input-sm`),
      PengkajianFormDefaults.tinggiBadan,
    );
    await this.fill(
      scope.locator(`${vitalSign.beratBadanGroup} input.input-sm`),
      PengkajianFormDefaults.beratBadan,
    );
    await this.fill(
      scope.locator(`${vitalSign.detakNadiGroup} input.input-sm`),
      PengkajianFormDefaults.detakNadi,
    );
    await this.fill(
      scope.locator(`${vitalSign.nafasGroup} input.input-sm`),
      PengkajianFormDefaults.nafas,
    );
    await this.fill(
      scope.locator(`${vitalSign.saturasiGroup} input.input-sm`),
      PengkajianFormDefaults.saturasi,
    );
    await this.fill(
      scope.locator(`${vitalSign.suhuGroup} input.input-sm`),
      PengkajianFormDefaults.suhu,
    );
    await scope.locator(vitalSign.detakJantungRegular).scrollIntoViewIfNeeded();
    await this.check(scope.locator(vitalSign.detakJantungRegular));
    await scope.locator(vitalSign.triageTidakGawat).scrollIntoViewIfNeeded();
    await this.check(scope.locator(vitalSign.triageTidakGawat));
  }

  private async fillPemeriksaanFisikSection(uniqueSuffix: string): Promise<void> {
    const { accordion, pemeriksaanFisik } = PengkajianAwalLocator.form;

    await this.expandAccordionSection(accordion.pemeriksaanFisikHeader, accordion.pemeriksaanFisikBody);

    const body = this.page.locator(accordion.pemeriksaanFisikBody);

    await this.fill(
      body.locator(pemeriksaanFisik.rencanaTindakan),
      `${PengkajianFormDefaults.rencanaTindakanPrefix} ${uniqueSuffix}`,
    );
    await this.fill(
      body.locator(pemeriksaanFisik.tindakanKeperawatan),
      `${PengkajianFormDefaults.tindakanKeperawatanPrefix} ${uniqueSuffix}`,
    );
    await this.fill(
      body.locator(pemeriksaanFisik.observasi),
      `${PengkajianFormDefaults.observasiPrefix} ${uniqueSuffix}`,
    );

    const merokokRadio = body.locator(pemeriksaanFisik.merokokTidak);
    await merokokRadio.scrollIntoViewIfNeeded();
    await this.check(merokokRadio);

    const alkoholRadio = body.locator(pemeriksaanFisik.alkoholTidak);
    await alkoholRadio.scrollIntoViewIfNeeded();
    await this.check(alkoholRadio);

    const kurangSayurRadio = body.locator(pemeriksaanFisik.kurangSayurTidak);
    await kurangSayurRadio.scrollIntoViewIfNeeded();
    await this.check(kurangSayurRadio);

    await this.fillAnatomiTubuhTag(body, uniqueSuffix);
  }

  private async fillAnatomiTubuhTag(scope: Locator, uniqueSuffix: string): Promise<void> {
    const { anatomiTubuh } = PengkajianAwalLocator.form.pemeriksaanFisik;
    const image = scope.locator(anatomiTubuh.image);

    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible({ timeout: ENV.TIMEOUT });

    const box = await image.boundingBox();

    if (!box) {
      throw new Error("Gambar anatomi tubuh tidak memiliki bounding box yang valid.");
    }

    await image.click({
      position: {
        x: box.width * PengkajianFormDefaults.anatomiClickXRatio,
        y: box.height * PengkajianFormDefaults.anatomiClickYRatio,
      },
    });

    const popover = this.page.locator(anatomiTubuh.popover);

    await expect(popover).toBeVisible({ timeout: ENV.TIMEOUT });
    await this.fill(
      popover.locator(anatomiTubuh.bagianTubuhInput),
      `${PengkajianFormDefaults.anatomiBagianTubuh} ${uniqueSuffix}`,
    );
    await this.fill(
      popover.locator(anatomiTubuh.keteranganInput),
      `${PengkajianFormDefaults.anatomiKeterangan} ${uniqueSuffix}`,
    );
    await this.click(popover.locator(anatomiTubuh.tambahButton));
    await expect(popover).toBeHidden({ timeout: ENV.TIMEOUT });
  }

  private async fillRiwayatPengobatanSection(): Promise<void> {
    const { accordion, riwayatPengobatan } = PengkajianAwalLocator.form;

    await this.expandAccordionSection(
      accordion.riwayatPengobatanHeader,
      accordion.riwayatPengobatanBody,
    );

    const body = this.page.locator(accordion.riwayatPengobatanBody);
    const defaultValue = PengkajianFormDefaults.riwayatPengobatanDefault;

    await this.fill(body.locator(riwayatPengobatan.obatSteroid), defaultValue);
    await this.fill(body.locator(riwayatPengobatan.pengencerDarah), defaultValue);
    await this.fill(body.locator(riwayatPengobatan.obatPengencerDahak), defaultValue);
    await this.fill(body.locator(riwayatPengobatan.obatPenyakitKronik), defaultValue);
    await this.fill(body.locator(riwayatPengobatan.obatLainnya), defaultValue);
    await this.fill(body.locator(riwayatPengobatan.obatSeringDikonsumsi), defaultValue);
  }

  private async fillDiagnosisKeperawatanSection(uniqueSuffix: string): Promise<void> {
    const { accordion } = PengkajianAwalLocator.form;

    await this.expandAccordionSection(
      accordion.diagnosisKeperawatanHeader,
      accordion.diagnosisKeperawatanBody,
    );

    const diagnosisBody = this.page.locator(accordion.diagnosisKeperawatanBody);
    const tambahButton = diagnosisBody.locator(accordion.tambahDiagnosisButton);

    await tambahButton.scrollIntoViewIfNeeded();
    await expect(tambahButton).toBeVisible({ timeout: ENV.TIMEOUT });
    await this.click(tambahButton);

    const modal = this.page.locator(PengkajianAwalLocator.modal.diagnosisKeperawatan.wrapper);
    await expect(modal).toBeVisible({ timeout: ENV.TIMEOUT });

    await this.fillDiagnosisModal(modal);
    await this.checkRandomCheckboxInScope(
      this.page.locator(PengkajianAwalLocator.form.implementasi.wrapper),
    );
    await this.fillEvaluasiSection(uniqueSuffix);
  }

  private async fillEvaluasiSection(uniqueSuffix: string): Promise<void> {
    const { evaluasi } = PengkajianAwalLocator.form;
    const scope = this.formWrapper.locator(evaluasi.wrapper);

    await scope.scrollIntoViewIfNeeded();
    await expect(scope).toBeVisible({ timeout: ENV.TIMEOUT });

    const evaluasiRadio = scope.locator(evaluasi.sudahTeratasi);

    await evaluasiRadio.scrollIntoViewIfNeeded();
    await this.check(evaluasiRadio);
    await this.fill(
      scope.locator(evaluasi.dischargePlanning),
      `${PengkajianFormDefaults.dischargePlanningPrefix} ${uniqueSuffix}`,
    );
  }

  private async fillDiagnosisModal(modal: Locator): Promise<void> {
    const { diagnosisKeperawatan } = PengkajianAwalLocator.modal;

    await this.selectDiagnosisKeperawatan(modal);

    await this.fillDiagnosisModalOptions(modal);

    const simpanButton = modal.locator(diagnosisKeperawatan.simpan);
    await simpanButton.scrollIntoViewIfNeeded();
    await expect(simpanButton).toBeVisible({ timeout: ENV.TIMEOUT });
    await this.click(simpanButton);
    await expect(modal).toBeHidden({ timeout: ENV.TIMEOUT });
  }

  private async selectMultiselectBySpaces(scope: Locator, inputSelector: string): Promise<void> {
    const multiselectRoot = scope
      .locator(`div.multiselect:not(.multiselect--disabled):has(${inputSelector})`)
      .first();
    const tags = multiselectRoot.locator(".multiselect__tags");
    const input = multiselectRoot.locator(inputSelector);

    await multiselectRoot.scrollIntoViewIfNeeded();
    await expect(multiselectRoot).toBeVisible({ timeout: ENV.TIMEOUT });

    await tags.click();
    await input.click();
    await input.pressSequentially(PengkajianFormDefaults.diagnosisSearchSpaces, { delay: 100 });

    const dropdown = multiselectRoot.locator(".multiselect__content-wrapper:visible");
    const highlightedOption = dropdown
      .locator(PengkajianAwalLocator.multiselect.optionHighlight)
      .first();
    const fallbackOption = dropdown
      .locator(PengkajianAwalLocator.multiselect.option)
      .filter({ hasNotText: /Data kosong|tidak ditemukan/i })
      .first();

    if (await highlightedOption.isVisible({ timeout: ENV.TIMEOUT }).catch(() => false)) {
      await highlightedOption.click();
      return;
    }

    await expect(fallbackOption).toBeVisible({ timeout: ENV.TIMEOUT });
    await fallbackOption.click();
  }

  private async selectDiagnosisKeperawatan(modal: Locator): Promise<void> {
    const { diagnosisKeperawatan } = PengkajianAwalLocator.modal;
    const expectedDiagnosis = PengkajianFormDefaults.diagnosisKeperawatan;
    const multiselectRoot = modal
      .locator(`div.multiselect:not(.multiselect--disabled):has(${diagnosisKeperawatan.diagnosisSearchInput})`)
      .first();

    if (await multiselectRoot.getByText(expectedDiagnosis, { exact: true }).isVisible().catch(() => false)) {
      return;
    }

    const tags = multiselectRoot.locator(".multiselect__tags");
    const input = multiselectRoot.locator(diagnosisKeperawatan.diagnosisSearchInput);

    await multiselectRoot.scrollIntoViewIfNeeded();
    await expect(multiselectRoot).toBeVisible({ timeout: ENV.TIMEOUT });
    await tags.click();
    await input.fill(expectedDiagnosis);

    const option = multiselectRoot
      .locator(PengkajianAwalLocator.multiselect.option)
      .filter({ hasText: expectedDiagnosis })
      .first();

    await expect(option).toBeVisible({ timeout: ENV.TIMEOUT });
    await option.click();
  }

  private async selectMultiselectBySpacesRandom(scope: Locator, inputSelector: string): Promise<void> {
    const multiselectRoot = scope
      .locator(`div.multiselect:not(.multiselect--disabled):has(${inputSelector})`)
      .first();
    const tags = multiselectRoot.locator(".multiselect__tags");
    const input = multiselectRoot.locator(inputSelector);

    await multiselectRoot.scrollIntoViewIfNeeded();
    await expect(multiselectRoot).toBeVisible({ timeout: ENV.TIMEOUT });

    await tags.click();
    await input.click();
    await input.pressSequentially(PengkajianFormDefaults.diagnosisSearchSpaces, { delay: 100 });

    const dropdown = multiselectRoot.locator(".multiselect__content-wrapper:visible");
    const options = dropdown
      .locator(PengkajianAwalLocator.multiselect.option)
      .filter({ hasNotText: /Data kosong|tidak ditemukan|Pencarian tidak ditemukan/i });

    await expect(options.first()).toBeVisible({ timeout: ENV.TIMEOUT });

    const count = await options.count();
    const randomOption = options.nth(RandomHelper.pickRandomIndex(count));

    await randomOption.scrollIntoViewIfNeeded();
    await randomOption.click();
  }

  private async checkRandomCheckboxInScope(scope: Locator): Promise<void> {
    const checkboxes = scope.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    if (count === 0) {
      throw new Error("Tidak ada checkbox yang tersedia pada section diagnosis keperawatan.");
    }

    const checkbox = checkboxes.nth(RandomHelper.pickRandomIndex(count));

    await expect(checkbox).toBeAttached({ timeout: ENV.TIMEOUT });

    if (!(await checkbox.isChecked())) {
      await this.checkHiddenCheckbox(checkbox);
    }
  }

  private async checkHiddenCheckbox(checkbox: Locator): Promise<void> {
    await checkbox.evaluate((element) => {
      const input = element as HTMLInputElement;

      input.checked = true;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  private async fillDiagnosisModalOptions(modal: Locator): Promise<void> {
    const kriteriaEvaluasi = modal.locator(
      'div.form-group:visible:has(label:has-text("Kriteria Evaluasi"))',
    );
    const rencanaIntervensi = modal.locator(
      'div.form-group:visible:has(label:has-text("Rencana Intervensi"))',
    );

    await this.checkFirstVisibleCheckbox(kriteriaEvaluasi);
    await this.checkFirstVisibleCheckbox(rencanaIntervensi);

    if ((await rencanaIntervensi.locator('input[type="checkbox"]:visible').count()) > 0) {
      return;
    }

    const customIntervensiInput = rencanaIntervensi.locator('input[placeholder="tambah intervensi"]');

    if (await customIntervensiInput.isVisible({ timeout: ENV.TIMEOUT }).catch(() => false)) {
      await this.fill(customIntervensiInput, PengkajianFormDefaults.intervensiManual);
    }
  }

  private async checkFirstCheckboxOrSkip(scope: Locator): Promise<void> {
    const checkboxes = scope.locator('input[type="checkbox"]:visible');

    if ((await checkboxes.count()) === 0) {
      return;
    }

    const checkbox = checkboxes.first();

    await expect(checkbox).toBeVisible({ timeout: ENV.TIMEOUT });

    if (!(await checkbox.isChecked())) {
      await checkbox.scrollIntoViewIfNeeded();
      await checkbox.click();
    }

    await expect(checkbox).toBeChecked();
  }

  private async checkFirstVisibleCheckbox(scope: Locator): Promise<void> {
    const checkbox = scope.locator('input[type="checkbox"]:visible').first();

    await expect(checkbox).toBeVisible({ timeout: ENV.TIMEOUT });

    if (!(await checkbox.isChecked())) {
      await checkbox.click();
    }

    await expect(checkbox).toBeChecked();
  }
}
