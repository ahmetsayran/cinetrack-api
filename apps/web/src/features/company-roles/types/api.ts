// ====================================================================
// 📨 BACKEND TYPES - Backend'den direkt import
// ====================================================================

export type {
  RoleResponseDto as CompanyRole,
  RoleCreatePayload as CompanyRoleCreatePayload,
  RoleUpdatePayload as CompanyRoleUpdatePayload,
  RoleMemberResponse as CompanyRoleMemberResponse,
  RoleShowResponse as CompanyRoleShowResponse,
} from '#backend/modules/auth/authorization/roles/types';

export type { RoleIndexQuery as CompanyRoleFilters } from '#backend/modules/auth/authorization/roles/types';
