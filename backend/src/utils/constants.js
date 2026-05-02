/**
 * AFSMS System Performance Benchmarks (Formalized from SRS v1.0)
 * 
 * These constants represent the non-functional performance requirements (NFRs)
 * mandated for the v1.0 release.
 */

module.exports = {
  // NFR-AFSMS-PERF-05: Capacity
  MAX_SIMULTANEOUS_USERS: 200,
  
  // NFR-AFSMS-PERF-06-10: Dynamic Response Times (95th Percentile targets)
  MAX_REPORT_LOAD_TIME_MS: 3000,
  MAX_REGISTRY_COMMIT_TIME_MS: 1000,
  MAX_SEARCH_RESPONSE_TIME_MS: 2000,
  
  // NFR-AFSMS-PERF-11-12: Background operations
  MAX_BACKUP_DOWNTIME_MINUTES: 5,
  MAX_ROLLBACK_TIME_SECONDS: 60,
  
  // Quality Attributes
  MIN_TEST_COVERAGE_PERCENT: 80,
  DATA_RETENTION_YEARS_AUDIT: 5
};
