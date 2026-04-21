export const DASHBOARD_LINKS = [
  {
    key: 'overview',
    label: 'Dashboard',
    href: '#/dashboard',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
          d="M4 13.5V20a1 1 0 0 0 1 1h5.5v-7.5H4Zm0-2h6.5V3H5a1 1 0 0 0-1 1v7.5ZM13.5 21H19a1 1 0 0 0 1-1v-5.5h-6.5V21Zm0-8.5H20V4a1 1 0 0 0-1-1h-5.5v9.5Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    key: 'products',
    label: 'Products',
    href: '#/dashboard/products',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
          d="M7 7h10v14H7V7Zm2-4h6l1 2H8l1-2Zm-4 4h14a2 2 0 0 1 2 2v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a2 2 0 0 1 2-2Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    key: 'orders',
    label: 'Orders',
    href: '#/dashboard/orders',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
          d="M6 2h12a2 2 0 0 1 2 2v18l-4-2-4 2-4-2-4 2V4a2 2 0 0 1 2-2Zm3 6h6v2H9V8Zm0 4h6v2H9v-2Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    key: 'profile',
    label: 'Profile',
    href: '#/dashboard/profile',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
          d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.7 0-8.5 2.3-8.5 5.1V22h17v-2.9C20.5 16.3 16.7 14 12 14Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    key: 'settings',
    label: 'Settings',
    href: '#/dashboard/settings',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
          d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.2 7.2 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.23-1.12.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 7.48a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.3.6.22l2.39-.96c.51.4 1.05.71 1.63.94l.36 2.54c.05.24.26.42.49.42h3.8c.24 0 .44-.18.49-.42l.36-2.54c.58-.23 1.12-.54 1.63-.94l2.39.96c.22.08.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    ),
  },
];

export const dashboardTitleFor = (key) => {
  const k = String(key || '').toLowerCase();
  const match = DASHBOARD_LINKS.find((l) => l.key === k);
  return match?.label || 'Dashboard';
};

