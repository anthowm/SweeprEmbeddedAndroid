export const API_CONFIG = {
  DEVELOPMENT: {
    protocol: 'http',
    domain: 'localhost',
    port: ':3000',
    authenticate: '/login',
    register_household_user: '/register_household_user',
    profile: '/profile/consumer',
    accountSettings: '/accountSettings',
    devices: '/devices',
    device_create_incident: '/device_create_incident',
    device_faq_list: '/site/api/documents',
    notifications: '/notifications',
    services: '/service',
    household: '/household',
    household_registration: '/user',
    household_services: '/household_service',
    household_incident: '/household_incident'
  },
  DEMO: {
    protocol: 'https',
    domain: 'api.sweepr.xyz',
    port: '',
    authenticate: '/login',
    register_household_user: '/user',
    profile: '/user/profile/consumer',
    accountSettings: '/accountSettings',
    devices: '/household/devices',
    device_create_incident: '/household/device',
    device_faq_list: '/site/api/documents',
    notifications: '/household/notifications',
    services: '/service',
    household: '/household',
    household_registration: '/user',
    household_services: '/household',
    household_incident: '/household/incident'
  },
  PRODUCTION: {
    protocol: 'https',
    domain: 'api.sweepr.com',
    port: '',
    authenticate: '/login',
    register_household_user: '/user',
    profile: '/user/profile/consumer',
    accountSettings: '/accountSettings',
    devices: '/household/devices',
    device_create_incident: '/household/device',
    device_faq_list: '/site/api/documents',
    notifications: '/household/notifications',
    services: '/service',
    household: '/household',
    household_registration: '/user',
    household_services: '/household',
    household_incident: '/household/incident'
  }
};

export const CMS_CONFIG = {
  DEVELOPMENT: {
    protocol: 'https',
    domain: 'hippo.sweepr.xyz',
    port: '',
    images: '/site/binaries/content/gallery'
  },
  DEMO: {
    protocol: 'https',
    domain: 'hippo.sweepr.xyz',
    port: '',
    images: '/site/binaries/content/gallery'
  },
  PRODUCTION: {
    protocol: 'https',
    domain: 'hippo.sweepr.com',
    port: '',
    images: '/site/binaries/content/gallery'
  }
};

export const API_AUTH_CONFIG = {
  magnolia: 'superuser:superuser'
};
