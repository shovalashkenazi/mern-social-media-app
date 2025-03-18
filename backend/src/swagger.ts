import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for my Node.js application",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: ["./src/routes/*.ts"], // הנתיב של הקבצים עם תיעוד ה-routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
