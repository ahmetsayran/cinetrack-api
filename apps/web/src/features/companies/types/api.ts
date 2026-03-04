// ====================================================================
// 📨 BACKEND TYPES - Backend'den direkt import
// ====================================================================

export type {
  CompanyResponse as Company,
  CompanyCreatePayload,
  CompanyUpdatePayload,
} from '#backend/modules/companies/types';

export type { CompanyIndexQuery as CompanyFilters } from '#backend/modules/companies/types';
