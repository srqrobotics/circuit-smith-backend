const axios = require("axios");
const { response } = require("../app");

const gptService = {
  // Generate response from GPT
  async generateResponse(prompt) {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(
        "Error calling OpenAI API:",
        error.response?.data || error.message
      );
      throw new Error("Failed to generate response from GPT");
    }
  },

  // Generate application suggestions based on electronic components
  async generateApplications(components) {
    const applicationsPrompt = `
    Based on the following electronic components:

    \t- ${components.join(", \n\t\t- ")}

    Generate a list of five possible project applications that can be built using these components. Each application should have a short description of its purpose.

    The response should be in the following JSON format:

    {
      "applications": [
          {
            "name": "Application Name",
            "description": "Brief description of how the system works"
          }
      ]
    }

    The generated applications should be practical, relevant, and make effective use of the given components.
  `;

    try {
      const responseText = await this.generateResponse(applicationsPrompt);
      console.log("GPT response:", responseText);

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not extract valid JSON from GPT response.");
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      if (error.message.includes("JSON")) {
        throw new Error(
          "Failed to parse response from GPT. Response was not valid JSON."
        );
      }
      throw error;
    }
  },

  //generateCode
  async generateCode(componentsInfo, selectedApp) {
    const codePrompt = `
    Generate a JSON file containing wiring configurations and an Arduino code snippet for an Arduino-based project. The project should include the following components: \n

      ${componentsInfo}

      \nThe application of this project is: ${selectedApp.name}. ${selectedApp.description}. 
      \nThe JSON file should follow this format:

      {
        "components": ["List of components used"],
        "wire": [
          {
            "ArduinoBoard": "Pin",
            "Component-1": "Pin"
          },
          {
            "ArduinoBoard": "Pin",
            "Component-2": "Pin"
          }
        ]
      }

      Additionally, provide Arduino code that initializes the components, reads data (if applicable), processes it, and executes necessary actions.
      Use appropriate libraries and ensure the code is structured with comments explaining each section.
      Make sure all pin names are in full capital letters.
      Make sure to use the given component names for the JSON file. Make sure to use the given component name for the wiring connection reference as well.
      Make sure to add 5V and GND connections for all modules with development board. Do not use VCC for the modules, instead use 5V as the pin name.
      Make sure to use D1, D2 etc. for digital pins in the development board.
      Make sure to use A0, A1 etc. for analog pins in the development board.
      Make sure to use just the Available pins names given infront of the respective component names for the wiring json.
  `;

    try {
      const responseText = await this.generateResponse(codePrompt);
      console.log("GPT response:", responseText);

      return responseText;
    } catch (error) {
      if (error.message.includes("code")) {
        throw new Error(
          "Failed to parse response from GPT. Response did not contain valid code."
        );
      }
      throw error;
    }
  },
};

module.exports = gptService;
