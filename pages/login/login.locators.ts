export const loginLocators = {
  usernameInput: 'input[placeholder="ID Pengguna"]',
  passwordInput: 'input[placeholder="Kata Sandi"]',
  klinikInput: 'input[placeholder="Pilih Klinik"]',
  loginButton: 'button:has-text("LOGIN")',
  klinikSuggestion: (klinik: string) => `text=${klinik}`
};