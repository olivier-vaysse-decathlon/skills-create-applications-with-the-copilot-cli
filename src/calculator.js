#!/usr/bin/env node

const usage = "Usage: node src/calculator.js <+|-|*|/|%|^> <first-number> <second-number>\n" +
  "       node src/calculator.js sqrt <number>";

function validateOperands(first, second) {
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    throw new TypeError("Operands must be finite numbers.");
  }
}

function add(first, second) {
  validateOperands(first, second);
  return first + second;
}

function subtract(first, second) {
  validateOperands(first, second);
  return first - second;
}

function multiply(first, second) {
  validateOperands(first, second);
  return first * second;
}

function divide(first, second) {
  validateOperands(first, second);
  if (second === 0) {
    throw new RangeError("Cannot divide by zero.");
  }
  return first / second;
}

function modulo(first, second) {
  validateOperands(first, second);
  if (second === 0) {
    throw new RangeError("Cannot take modulo by zero.");
  }
  return first % second;
}

function power(base, exponent) {
  validateOperands(base, exponent);
  return base ** exponent;
}

function squareRoot(number) {
  if (!Number.isFinite(number)) {
    throw new TypeError("Operands must be finite numbers.");
  }
  if (number < 0) {
    throw new RangeError("Cannot take the square root of a negative number.");
  }
  return Math.sqrt(number);
}

const operations = new Map([
  ["+", add],
  ["-", subtract],
  ["*", multiply],
  ["/", divide],
  ["%", modulo],
  ["^", power],
  ["sqrt", squareRoot],
]);

function calculate(operation, first, second) {
  const operationFunction = operations.get(operation);
  if (!operationFunction) {
    throw new RangeError(`Invalid operation "${operation}". Choose +, -, *, /, %, ^, or sqrt.`);
  }
  return operationFunction(first, second);
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function main(args) {
  const [operation, firstInput, secondInput, ...extraArguments] = args;

  if (!operation || firstInput === undefined || extraArguments.length > 0 ||
      (operation === "sqrt" ? secondInput !== undefined : secondInput === undefined)) {
    fail(usage);
    return;
  }

  const first = firstInput.trim() === "" ? Number.NaN : Number(firstInput);
  const second = secondInput === undefined ? undefined :
    secondInput.trim() === "" ? Number.NaN : Number(secondInput);

  let result;
  try {
    result = calculate(operation, first, second);
  } catch (error) {
    if (error instanceof TypeError || error instanceof RangeError) {
      fail(error.message);
      return;
    }
    throw error;
  }

  console.log(result);
}

module.exports = { add, subtract, multiply, divide, modulo, power, squareRoot, calculate };

if (require.main === module) {
  main(process.argv.slice(2));
}
