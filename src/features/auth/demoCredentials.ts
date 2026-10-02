// Fake values the auth forms open with, so one click signs in (user decision 2026-10-02).
// Input defaults only. The password never reaches the store, storage or the URL; the register
// email is kept like any typed email (`registeredEmail`).
export const demoCredentials = {
  businessName: "Brand One",
  email: "test@demo.com",
  phone: "66000000000",
  password: "DemoPass2026!",
} as const;
