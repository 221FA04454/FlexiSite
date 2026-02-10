import { useTenantStore, ROLES } from '../store/saas/tenantStore';

/**
 * Permission Matrix
 * owner	✔ ✔ ✔ ✔ ✔ ✔
 * admin	✔ ✔ ✔ ✔ ✖ ✔
 * editor	✔ ✔ ✖ ✖ ✖ ✔
 * viewer	✖ ✖ ✖ ✖ ✖ ✔
 */

const PERMISSION_MATRIX = {
    [ROLES.OWNER]: {
        edit: true,
        publish: true,
        manage_domains: true,
        manage_api_keys: true,
        manage_tenants: true,
        analytics: true,
        billing: true
    },
    [ROLES.ADMIN]: {
        edit: true,
        publish: true,
        manage_domains: true,
        manage_api_keys: true,
        manage_tenants: false,
        analytics: true,
        billing: true
    },
    [ROLES.EDITOR]: {
        edit: true,
        publish: true,
        manage_domains: false,
        manage_api_keys: false,
        manage_tenants: false,
        analytics: true,
        billing: false
    },
    [ROLES.VIEWER]: {
        edit: false,
        publish: false,
        manage_domains: false,
        manage_api_keys: false,
        manage_tenants: false,
        analytics: true,
        billing: false
    }
};

/**
 * Hook to check if current user has a specific permission in the active tenant.
 * @param {string} requiredPermission - Permission key from matrix
 * @returns {boolean}
 */
export const usePermission = (requiredPermission) => {
    const { tenants, activeTenantId } = useTenantStore();
    
    // In a real app, we'd get the current user ID from an Auth store
    const currentUserId = 'user_001'; 
    
    const activeTenant = tenants[activeTenantId];
    if (!activeTenant) return false;

    const member = activeTenant.members.find(m => m.userId === currentUserId);
    if (!member) return false;

    const role = member.role;
    const permissions = PERMISSION_MATRIX[role] || PERMISSION_MATRIX[ROLES.VIEWER];

    return !!permissions[requiredPermission];
};

export default usePermission;
