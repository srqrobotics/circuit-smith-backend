const fs = require("fs");
const path = require("path");

const fileController = {
  // Save configuration files
  async saveConfig(req, res) {
    try {
      const { file, content, projectId } = req.body;

      // Log the received data
      console.log("Saving config:", {
        file,
        projectId,
        contentType: typeof content,
      });

      let filePath;
      let filename;

      if (projectId && projectId !== "0") {
        // Save in project-specific folder: public/projects/projectId/
        const projectDir = path.join(
          process.cwd(),
          "..",
          "circuit-smith",
          "public",
          "projects",
          projectId
        );

        // Create project directory if it doesn't exist
        if (!fs.existsSync(projectDir)) {
          fs.mkdirSync(projectDir, { recursive: true });
          console.log("Created project directory:", projectDir);
        }

        // Determine filename based on content type
        if (file.includes("config") || file.includes(".json")) {
          filename = "config.json";
        } else if (file.includes(".ino") || file.includes("code")) {
          filename = "code.ino";
        } else {
          filename = path.basename(file);
        }

        filePath = path.join(projectDir, filename);
      } else {
        // Fallback to original structure for demo files
        filename = path.basename(file);
        filePath = path.join(
          process.cwd(),
          "..",
          "circuit-smith",
          "public",
          file.replace(/^\//, "")
        );
      }

      let fileContent;
      if (typeof content === "object") {
        // Format JSON with indentation for readability
        fileContent = JSON.stringify(content, null, 2);
      } else if (Array.isArray(content)) {
        // Handle array content (like Arduino code lines)
        fileContent = content.join("\n");
      } else {
        // Handle string content - ensure proper line breaks for code files
        if (filename === "code.ino" && typeof content === "string") {
          // Ensure Arduino code has proper line breaks
          fileContent = content
            .replace(/\\n/g, "\n") // Replace escaped newlines with actual newlines
            .replace(/;(?!\s*\/\/)/g, ";\n") // Add newlines after semicolons (except in comments)
            .replace(/\{/g, "{\n") // Add newlines after opening braces
            .replace(/\}/g, "\n}\n") // Add newlines before and after closing braces
            .replace(/\n\s*\n\s*\n/g, "\n\n") // Remove excessive blank lines
            .trim();
        } else {
          fileContent = content;
        }
      }

      // Log before writing
      console.log("Writing to:", filePath);

      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write file synchronously to ensure it's written
      fs.writeFileSync(filePath, fileContent, "utf8");

      // Log after successful write
      console.log("Successfully wrote to file:", filename);

      return res.json({
        success: true,
        path: filePath,
        projectId: projectId,
      });
    } catch (error) {
      // Enhanced error logging
      console.error("Error saving config:", {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        message: error instanceof Error ? error.message : "Unknown error",
        cwd: process.cwd(),
      });

      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to save config",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  },

  // Get file content
  async getFileContent(req, res) {
    try {
      const { path: filePath, projectId } = req.query;

      let fullPath;
      if (projectId && projectId !== "0") {
        // Look in project-specific folder
        const projectDir = path.join(
          process.cwd(),
          "..",
          "circuit-smith",
          "public",
          "projects",
          projectId
        );
        const filename = path.basename(filePath);
        fullPath = path.join(projectDir, filename);
      } else {
        fullPath = path.join(
          process.cwd(),
          "..",
          "circuit-smith",
          "public",
          filePath.replace(/^\//, "")
        );
      }

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({
          content: "",
          error: "File not found",
        });
      }

      const content = fs.readFileSync(fullPath, "utf-8");
      return res.json({ content });
    } catch (error) {
      console.error("Error reading file:", error);
      return res.status(500).json({
        content: "",
        error: "Failed to read file",
      });
    }
  },
};

module.exports = fileController;
