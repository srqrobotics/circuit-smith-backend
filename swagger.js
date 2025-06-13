const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Circuit Smith API",
      version: "1.0.0",
      description: "API for Circuit Smith electronics component management",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User unique identifier",
            },
            full_name: {
              type: "string",
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
          required: ["full_name", "email"],
        },
        UserSignup: {
          type: "object",
          properties: {
            full_name: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              maxLength: 255,
              description: "User's email address",
            },
            password: {
              type: "string",
              minLength: 6,
              maxLength: 128,
              description: "User's password",
            },
          },
          required: ["full_name", "email", "password"],
        },
        UserSignin: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              description: "User's password",
            },
          },
          required: ["email", "password"],
        },
      },
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
fs.writeFileSync("./src/swagger.json", JSON.stringify(swaggerSpec, null, 2));

console.log("Swagger JSON file has been generated");
