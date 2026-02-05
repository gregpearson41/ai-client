const ROLES = {
  APP_ADMIN: 'App_Admin',
  OWNER: 'Owner',
  EDITOR: 'Editor',
  VIEWER: 'Viewer'
};

const ROLE_HIERARCHY = {
  [ROLES.APP_ADMIN]: 4,
  [ROLES.OWNER]: 3,
  [ROLES.EDITOR]: 2,
  [ROLES.VIEWER]: 1
};

// Define permissions for each role
const PERMISSIONS = {
  [ROLES.APP_ADMIN]: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_roles'],
  [ROLES.OWNER]: ['create', 'read', 'update', 'delete', 'manage_users'],
  [ROLES.EDITOR]: ['create', 'read', 'update'],
  [ROLES.VIEWER]: ['read']
};

const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.includes(permission) || false;
};

const hasMinimumRole = (userRole, requiredRole) => {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
};

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
  PERMISSIONS,
  hasPermission,
  hasMinimumRole
};
