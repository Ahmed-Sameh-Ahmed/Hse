/**
 * Centralized routes for Master Data module
 * This file contains all routes used across the master data tests
 * to facilitate consistency and easy maintenance
 */

export const ROUTES = {
  // Main Master Data page
  INCIDENTS_MANAGEMENT: "/incidents-management",
  USER_MANAGEMENT: "/users-management",
  SETTINGS: "/settings",

  // Assets
  ASSETS: `/incidents-management/assets`,
  ASSETS_CREATE: "/incidents-management/assets/create",

  // Asset Types
  ASSET_TYPES: "/incidents-management/asset-types",
  ASSET_TYPES_CREATE: "/incidents-management/asset-types/create",

  // Hazards
  HAZARDS: "/incidents-management/hazards",
  HAZARDS_CREATE: "/incidents-management/hazards/create",

  // Consequences
  CONSEQUENCES: "/incidents-management/consequences",
  CONSEQUENCES_CREATE: "/incidents-management/consequences/create",

  // Causes
  CAUSES: "/incidents-management/causes",
  CAUSES_CREATE: "/incidents-management/causes/create",

  // Organization Hierarchy
  ORGANIZATION_HIERARCHY: "/incidents-management/organization-hierarchy",
  ORGANIZATION_HIERARCHY_CREATE:
    "/incidents-management/organization-hierarchy/create",

  // Sites
  SITES: "/incidents-management/sites",
  SITES_CREATE: "/incidents-management/sites/create",

  // Classifications
  CLASSIFICATIONS: "/incidents-management/classifications",
  CLASSIFICATIONS_CREATE: "/incidents-management/classifications/create",

  // Task Analysis
  TASK_ANALYSIS: "/incidents-management/task-analysis",
  TASK_ANALYSIS_CREATE: "/incidents-management/task-analysis/create",

  // Root Cause Analysis
  ROOT_CAUSE_ANALYSIS: "/incidents-management/root-cause-pillars",
  ROOT_CAUSE_ANALYSIS_CREATE: "/incidents-management/root-cause-pillars/create",

  // SEVERITY_MATRIX
  SEVERITY_MATRIX: "/incidents-management/severity-matrix",
} as const;

export default ROUTES;
