export const LandingData = {
  patientManagement: {
    pratama: {
      expectedUrl: "/login",
      expectedText: "eClinic - Klinik Pratama",
    },
    utama: {
      expectedUrl: "/login/",
      expectedText: "eClinic - Klinik Utama",
    },
    // puskesmas: {
    //   expectedUrl: "https://demo.epuskesmas.id/login",
    //   expectedText: "ePuskesmas",
    // },
    // mobile: {
    //   expectedUrl: "",
    //   expectedText: "Infokes Mobile App",
    // },
  },
} as const;
