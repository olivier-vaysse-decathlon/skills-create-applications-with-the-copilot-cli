const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const { add, subtract, multiply, divide, calculate } = require("../calculator.js");

test("addition handles positive, negative, decimal, and zero operands", () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-2, 3), 1);
  assert.equal(add(0.1, 0.2), 0.30000000000000004);
  assert.equal(add(0, 0), 0);
});

test("subtraction handles positive, negative, decimal, and zero operands", () => {
  assert.equal(subtract(10, 4), 6);
  assert.equal(subtract(3, 5), -2);
  assert.equal(subtract(5.5, 2.25), 3.25);
  assert.equal(subtract(0, 0), 0);
});

test("multiplication handles positive, negative, decimal, and zero operands", () => {
  assert.equal(multiply(45, 2), 90);
  assert.equal(multiply(-3, 4), -12);
  assert.equal(multiply(1.5, 2), 3);
  assert.equal(multiply(7, 0), 0);
});

test("division handles positive, negative, decimal, and zero numerators", () => {
  assert.equal(divide(20, 5), 4);
  assert.equal(divide(-9, 3), -3);
  assert.equal(divide(7, 2), 3.5);
  assert.equal(divide(0, 5), 0);
});

test("division rejects positive and negative zero divisors", () => {
  assert.throws(() => divide(1, 0), { name: "RangeError", message: "Cannot divide by zero." });
  assert.throws(() => divide(1, -0), { name: "RangeError", message: "Cannot divide by zero." });
});

test("calculate dispatches each supported operator", () => {
  assert.equal(calculate("+", 2, 3), 5);
  assert.equal(calculate("-", 10, 4), 6);
  assert.equal(calculate("*", 45, 2), 90);
  assert.equal(calculate("/", 20, 5), 4);
});

test("arithmetic functions reject non-numeric and non-finite operands", () => {
  const functions = [add, subtract, multiply, divide];
  for (const arithmeticFunction of functions) {
    for (const [first, second] of [["2", 3], [Number.NaN, 1], [1, Infinity]]) {
      assert.throws(() => arithmeticFunction(first, second), {
        name: "TypeError",
        message: "Operands must be finite numbers.",
      });
    }
  }
});

test("calculate rejects unsupported operators", () => {
  assert.throws(() => calculate("%", 2, 3), {
    name: "RangeError",
    message: 'Invalid operation "%". Choose +, -, *, or /.',
  });
});

test("CLI prints results for the examples in the image", () => {
  const script = require.resolve("../calculator.js");
  const examples = [
    { args: ["+", "2", "3"], expected: "5\n" },
    { args: ["-", "10", "4"], expected: "6\n" },
    { args: ["*", "45", "2"], expected: "90\n" },
    { args: ["/", "20", "5"], expected: "4\n" },
  ];

  for (const { args, expected } of examples) {
    const result = spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });
    assert.equal(result.status, 0);
    assert.equal(result.stdout, expected);
    assert.equal(result.stderr, "");
  }
});

test("CLI reports division by zero and invalid input", () => {
  const script = require.resolve("../calculator.js");

  const divisionByZero = spawnSync(process.execPath, [script, "/", "1", "0"], { encoding: "utf8" });
  assert.equal(divisionByZero.status, 1);
  assert.match(divisionByZero.stderr, /Cannot divide by zero/);

  const invalidInput = spawnSync(process.execPath, [script, "+", "one", "2"], { encoding: "utf8" });
  assert.equal(invalidInput.status, 1);
  assert.match(invalidInput.stderr, /Operands must be finite numbers/);
});
