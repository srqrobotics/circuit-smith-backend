const jwt = require("jsonwebtoken");

const gptService = require("../services/gptService.js");
const gptController = {
  // Generate application suggestions based on components
  async generate(req, res) {
    try {
      const { components } = req.body;
      // We can access authenticated user from req.user
      const userId = req.user.id; // Assuming user ID is stored in the JWT token

      if (
        !components ||
        !Array.isArray(components) ||
        components.length === 0
      ) {
        return res.status(400).json({
          error: "Components array is required and must not be empty",
        });
      }

      console.log(`User ${userId} is generating applications for components`);
      const applications = await gptService.generateApplications(components);

      res.json({
        success: true,
        applications,
        userId: userId, // Optionally include user ID in response
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  //generateCode
  async generateCode(req, res) {
    try {
      const { componentsInfo, selectedApp } = req.body;

      if (!componentsInfo || typeof componentsInfo !== "string") {
        return res.status(400).json({
          error: "Components information is required and must be a string",
        });
      }

      if (!selectedApp || typeof selectedApp !== "object") {
        return res.status(400).json({
          error:
            "Selected application information is required and must be an object",
        });
      }

      console.log(`Generating code for components: ${componentsInfo}`);
      const code = await gptService.generateCode(componentsInfo, selectedApp);

      res.json({
        success: true,
        code,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
};

module.exports = gptController;
