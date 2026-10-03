// Fake values the register form and the first onboarding modal open with, so one click signs up and
// one click continues (user decisions 2026-10-02); the onboarding name is the store's demo user.
// Input defaults only: nothing typed reaches the store, storage or the URL.
export const demoCredentials = {
  businessName: "Brand One",
  email: "test@demo.com",
  phone: "66000000000",
  password: "DemoPass2026!",
  staffCount: "2-10",
} as const;
