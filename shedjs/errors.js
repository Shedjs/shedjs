export class FrameworkError extends Error {
  constructor(module, code, message, meta = {}) {
    super(`[${module}] ${code}: ${message}`);
    this.name = "FrameworkError";
    this.module = module;  // 'DOM', 'EVENT', 'ROUTE', STATE'
    this.code = code;      // Error code (e.g., 'INVALID_NODE')
    this.meta = meta;      // Additional debug context
  }
}
