/**
 * AFSMS System Performance Benchmarks (Formalized from SRS v1.0)
 * 
 * Used for timeout logic, UI performance indicators, and compliance documentation.
 */

export const PERFORMANCE_BENCHMARKS = {
  MAX_SIMULTANEOUS_USERS: 200,
  MAX_REPORT_LOAD_TIME_MS: 3000,
  MAX_REGISTRY_COMMIT_TIME_MS: 1000,
  MAX_SEARCH_RESPONSE_TIME_MS: 2000,
};

export const SYSTEM_LIMITS = {
  MAX_FILE_UPLOAD_SIZE_MB: 10,
  SESSION_TIMEOUT_HOURS: 8,
};
