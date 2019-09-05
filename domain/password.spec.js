const password = require("./password");

describe("password hashing", () => {
  it("should hash and compare", async () => {
    const pwd = "1234";
    const hashedPass = await password.hash(pwd);
    expect(hashedPass).not.toEqual(pwd);
    expect(await password.compare(pwd, hashedPass)).toBe(true);
  });
});
