// Auth slice. Nothing typed into the auth forms is kept except the register email, which the
// verify page echoes back; passwords are never stored or sent.
export const authSeed: { onboardingDone: boolean; registeredEmail: string } = {
  onboardingDone: false,
  registeredEmail: "",
};
