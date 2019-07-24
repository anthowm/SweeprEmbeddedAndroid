import t from 'tcomb-form-native';
import zxcvbn from 'zxcvbn';

/** PwdBlackList
 * A custom list of strings that are specifically not allowed as passwords,
 * commonly this blacklist is application specific (domain name etc.)
 * This list should be concatenated with a user's e-mail address and possibly
 * other strings that were entered in the same form (name, phone# etc.).
 */
export const PwdBlackList = ['SWEEPR', 'sweepr', 'Sweepr'];

export const FieldValidation = {
  /** E-mail validation
   * Checks that a string has the structure of an e-mail address.
   */
  email: t.refinement(t.String, (email) => {
    const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return reg.test(email);
  }),

  /** Password validation
   * Runs a password strength check that returns an object with a score.
   * If that score is >= 2, the password is strong enough.
   */
  password: t.refinement(t.String, (password) => {
    const score = zxcvbn(password, PwdBlackList).score;
    return score >= 2;
  }),

  /** Boolean positive validation
   * Checks that given boolean is true.
   */
  checked: t.refinement(t.Boolean, (bool) => {
    return bool;
  })
};
