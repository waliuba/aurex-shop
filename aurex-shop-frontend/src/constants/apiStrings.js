export const apiStrings = {
  storage: {
    tokenKey: 'token',
  },
  paths: {
    admin: {
      dashboard: '/api/admin/dashboard',
      profile: '/api/admin/profile',
      permissions: '/api/admin/permissions',
      sessions: '/api/admin/security/sessions',
      logoutAllSessions: '/api/admin/security/logout-all',
      changePassword: '/api/admin/security/password',
      twoFactor: '/api/admin/security/2fa',
      twoFactorSetup: '/api/admin/security/2fa/setup',
      twoFactorEnable: '/api/admin/security/2fa/enable',
      twoFactorDisable: '/api/admin/security/2fa/disable',
      activityLog: '/api/admin/activity-log',
      preferences: '/api/admin/preferences',
    },
    auth: {
      me: '/api/auth/me',
      login: '/api/auth/login',
    },
    users: {
      me: '/api/users/me',
      myPassword: '/api/users/me/password',
      list: '/api/users',
    },
    products: {
      list: '/api/products',
      byId: (productId) => `/api/products/${productId}`,
    },
    orders: {
      list: '/api/orders',
      my: '/api/orders/my',
      byUser: (customerId) => `/api/orders/user/${customerId}`,
      status: (orderId) => `/api/orders/${orderId}/status`,
    },
  },
  defaults: {
    orderStatusPending: 'Pending',
    customerName: 'Customer',
    userName: 'User',
  },
  errors: {
    requestFailed: (status) => `Request failed (${status})`,
  },
};

export default apiStrings;
