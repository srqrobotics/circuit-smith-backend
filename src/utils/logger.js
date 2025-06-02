const logger = {
  info: (message, meta = {}) => {
    console.info(new Date().toISOString(), "INFO:", message, meta);
  },

  error: (message, error = {}) => {
    console.error(
      new Date().toISOString(),
      "ERROR:",
      message,
      error.stack || error
    );
  },

  warn: (message, meta = {}) => {
    console.warn(new Date().toISOString(), "WARN:", message, meta);
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(new Date().toISOString(), "DEBUG:", message, meta);
    }
  },
};

module.exports = logger;
