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
            fullName: {
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
          required: ["fullName", "email"],
        },
        UserSignup: {
          type: "object",
          properties: {
            fullName: {
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
          required: ["fullName", "email", "password"],
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
        ComponentsRequest: {
          type: "object",
          properties: {
            components: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of electronic component names",
            },
          },
          required: ["components"],
        },
        ApplicationItem: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the application",
            },
            description: {
              type: "string",
              description: "Brief description of the application",
            },
          },
        },
        ApplicationsResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indicates if the request was successful",
            },
            applications: {
              type: "object",
              properties: {
                applications: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/ApplicationItem",
                  },
                  description: "List of possible applications",
                },
              },
            },
            userId: {
              type: "integer",
              description: "ID of the user who made the request",
            },
          },
        },
        GenerateCodeRequest: {
          type: "object",
          properties: {
            componentsInfo: {
              type: "string",
              description: "Information about the components to be used",
            },
            selectedApp: {
              type: "object",
              description: "Selected application information",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the selected application",
                },
                description: {
                  type: "string",
                  description: "Description of the selected application",
                },
              },
              required: ["name", "description"],
            },
          },
          required: ["componentsInfo", "selectedApp"],
        },
        GenerateCodeResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indicates if the request was successful",
            },
            code: {
              type: "string",
              description:
                "Generated code with wiring configuration in JSON format",
            },
          },
        },
      },
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
fs.writeFileSync("./src/swagger.json", JSON.stringify(swaggerSpec, null, 2));

console.log("Swagger JSON file has been generated");
