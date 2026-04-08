import argon2 from "argon2";

async function passwordHash(password: string) {
  return await argon2.hash(password);
}

async function passwordVerify(passwordHash: string, password: string) {
  return await argon2.verify(passwordHash, password);
}

export { passwordHash, passwordVerify };
