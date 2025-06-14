import { cn } from "../utils/cn";

describe("cn utility", () => {
  it("concatenates class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("merges tailwind classes with precedence", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
