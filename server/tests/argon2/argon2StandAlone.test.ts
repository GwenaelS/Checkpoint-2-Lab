import { passwordHash, passwordVerify } from "./argon2StandAlone";

describe("Test unitaire sur Argon2", () => {
  it("SUCCES ===> Hash password", async () => {
    const password = "12345";

    const result = await passwordHash(password);

    // Si le test reussi, cela doit retourner le mot de passe hasher
    // Autrement c'est une erreur qu'il renvoie
    expect(typeof result).toBe("string");
    // Si le test reussi, cela doit retourner le mot de passe hasher et non le mot de passe originel
    expect(result).not.toBe(password);
  });
  it("SUCCES ===> Verify password", async () => {
    const password = "12345";

    const hash = await passwordHash(password);

    const result = await passwordVerify(hash, password);

    // Si le test reussi, la comparaison doit retourner true
    // Autrement c'est false
    expect(result).toBe(true);
  });
  it("FAIL ===> Verify password", async () => {
    const password = "12345";
    const passwordInvalid = "123456";

    const hash = await passwordHash(passwordInvalid);

    const result = await passwordVerify(hash, password);

    // Si le test échoue, la comparaison doit retourner false
    expect(result).toBe(false);
  });
});
