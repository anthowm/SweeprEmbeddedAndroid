import { CMS_CONFIG } from './API.config';
import { ENVIRONMENT } from './app.config';

/** Hippo CMS utility classes
 *
 */

export class Utils {
  static url(path = '') {
    let o = CMS_CONFIG[ENVIRONMENT];
    return o.protocol + '://' + o.domain + o.port + o[path];
  }
}

export class Images {
  static service(category, serviceName, imageName) {
    return `${Utils.url('images')}/services/${category}/${serviceName}/${imageName}`.toLowerCase();
  }
}
