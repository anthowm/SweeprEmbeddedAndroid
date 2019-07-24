import { API_CONFIG } from './API.config';
import { ENVIRONMENT } from './app.config';

/** URIBuilder utility function.
 * Builds up a string (URL) based on mode, path and config.
 * @mode   # App mode.
 *         # May differ from API_CONFIG environment, if app state has changed it.
 * @path   # URL path, determines which resource to target.
 *         # Required.
 * @config # Custom config which overrides default config.
 *         # Required.
 */
export const URIBuilder = (resource, mode, config) => {
  let o = Object.assign({}, API_CONFIG[mode], config);

  return o.protocol + '://' + o.domain + o.port + o[resource];
};

/** Parameterize utility function.
 * Takes an object argument and returns a string formatted as a URL parameter string.
 * @obj    # Object to parameterize.
 *         # Required.
 */
export const parameterize = (obj) => {
  let params = '?';
  for (let key in obj) {
    params.charAt(params.length - 1) === '?'
      ? (params = params + key + '=' + obj[key])
      : (params = params + '&' + key + '=' + obj[key]);
  }
  return params;
};

/** Endpoints utility function.
 * Takes mode and config (all optional) and returns an object of readily built URLs.
 * @mode     # Application mode, defaults to 'DEMO'.
 *           # Optional.
 * @config   # config; an object that will override any config of the API, useful if the resource is hosted under a custom port or protocol.
 *           # Defaults to an empty object.
 *           # Optional.
 */
export const endpoints = (mode = 'DEMO', config = {}) => {
  return {
    profile: URIBuilder('profile', mode, config),
    accountSettings: URIBuilder('accountSettings', mode, config),
    devices: URIBuilder('devices', mode, config),
    device_create_incident: URIBuilder('device_create_incident', mode, config),
    device_faq_list: URIBuilder('device_faq_list', mode, config),
    services: URIBuilder('services', mode, config),
    notifications: URIBuilder('notifications', mode, config),
    services: URIBuilder('services', mode, config),
    authenticate: URIBuilder('authenticate', mode, config),
    register_household_user: URIBuilder('register_household_user', mode, config),
    household: URIBuilder('household', mode, config),
    household_registration: URIBuilder('household_registration', mode, config),
    household_services: URIBuilder('household_services', mode, config),
    household_incident: URIBuilder('household_incident', mode, config)
  };
};

/** getURL utility function.
 * Takes arguments needed to build up and return a URL suitable for the API.
 * @resource # String, the resource requested from the API.
 *           # Required.
 * @mode     # Application mode, defaults to 'DEMO'.
 *           # Optional.
 * @addendum # A configuration object that supports the following properties.
 *           # path; an additional path that will be appended to the standard config, before any parameters.
 *           # params; an object that will be parameterized and appended lastly on the URL.
 *           # config; an object that will override any config of the API, useful if the resource is hosted under a custom port or protocol.
 *           # All optional.
 */
export const getURL = (resource, mode = 'DEMO', addendum = {}) => {
  if (!resource) {
    throw new TypeError('Missing resource parameter', 'API.config.js');
  }
  const path = addendum.path ? addendum.path : '';
  const params = addendum.params ? parameterize(addendum.params) : '';

  return addendum.config
    ? endpoints(mode, addendum.config)[resource] + path + params
    : endpoints(mode)[resource] + path + params;
};
