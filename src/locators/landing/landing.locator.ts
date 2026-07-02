export const LandingPageLocator = {
  menu: {
    patientManagement: {
      title: "#services ul.bg-primary-2",

      submenu: {
        pratama: '#services ul.bg-primary-2 a:has-text("eClinic - Klinik Pratama")',
        utama: '#services ul.bg-primary-2 a:has-text("eClinic - Klinik Utama")',
        puskesmas: '#services ul.bg-primary-2 a:has-text("ePuskesmas")',
        mobile: '#services ul.bg-primary-2 a:has-text("Infokes Mobile App")',
      },
    },

    programManagement: {
      title: "#services ul.bg-child-3",

      submenu: {
        dinkesKabupaten: '#services ul.bg-child-3 a:has-text("eDinkes Kota/Kab")',
        dinkesProvinsi: '#services ul.bg-child-3 a:has-text("eDinkes Provinsi")',
        dashboardNasional: '#services ul.bg-child-3 a:has-text("Dashboard Nasional")',
      },
    },

    organizationManagement: {
      title: "#services ul.bg-child-4",

      submenu: {
        rujukan: '#services ul.bg-child-4 a:has-text("eRujukan")',
        farmasi: '#services ul.bg-child-4 a:has-text("eFarmasi")',
        antrian: '#services ul.bg-child-4 a:has-text("eAntrian")',
        holding: '#services ul.bg-child-4 a:has-text("eHolding")',
      },
    },
  },
} as const;
