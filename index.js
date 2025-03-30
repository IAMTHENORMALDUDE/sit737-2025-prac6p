const express = require("express");
const winston = require("winston");
const app = express();
const port = 3000;

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "calculator-microservice" },
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Middleware to log all requests
app.use((req, res, next) => {
  const { method, url, query, ip } = req;
  logger.info({
    message: `Request received`,
    method,
    url,
    query,
    ip,
  });
  next();
});

// Helper function to validate numbers
const validateNumbers = (num1, num2) => {
  if (isNaN(num1) || isNaN(num2)) {
    return { isValid: false, message: "Invalid input: Both parameters must be numbers" };
  }
  return { isValid: true };
};

// Addition endpoint
app.get("/add", (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  const validation = validateNumbers(num1, num2);
  if (!validation.isValid) {
    logger.error(`Error in /add: ${validation.message}`);
    return res.status(400).json({ error: validation.message });
  }
  const result = num1 + num2;
  logger.info(`Addition: ${num1} + ${num2} = ${result}`);
  res.json({ result });
});

// Subtraction endpoint
app.get("/subtract", (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  const validation = validateNumbers(num1, num2);
  if (!validation.isValid) {
    logger.error(`Error in /subtract: ${validation.message}`);
    return res.status(400).json({ error: validation.message });
  }
  const result = num1 - num2;
  logger.info(`Subtraction: ${num1} - ${num2} = ${result}`);
  res.json({ result });
});

// Multiplication endpoint
app.get("/multiply", (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  const validation = validateNumbers(num1, num2);
  if (!validation.isValid) {
    logger.error(`Error in /multiply: ${validation.message}`);
    return res.status(400).json({ error: validation.message });
  }
  const result = num1 * num2;
  logger.info(`Multiplication: ${num1} * ${num2} = ${result}`);
  res.json({ result });
});

// Division endpoint
app.get("/divide", (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  const validation = validateNumbers(num1, num2);
  if (!validation.isValid) {
    logger.error(`Error in /divide: ${validation.message}`);
    return res.status(400).json({ error: validation.message });
  }
  if (num2 === 0) {
    logger.error("Error in /divide: Division by zero is not allowed");
    return res.status(400).json({ error: "Division by zero is not allowed" });
  }
  const result = num1 / num2;
  logger.info(`Division: ${num1} / ${num2} = ${result}`);
  res.json({ result });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Start the server
app.listen(port, () => {
  logger.info(`Calculator microservice running on port ${port}`);
});
