import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Button from 'apsl-react-native-button';
import t from 'tcomb-form-native';
import _ from 'lodash';
import zxcvbn from 'zxcvbn';
import TextLink from '../../components/Text/TextLink';
import { controlLabel, textbox, button, buttonText, link } from '../../Styles/Form';
import { fn_PwdWithStrengthCheck, PwdBlackList } from '../../components/Form/PwdWithStrengthCheck';
import { fn_SwitchWithLink } from '../../components/Form/SwitchWithLink';
import ServerError from '../../components/Form/ServerError';
import { FieldValidation } from '../../lib/Form.utils';
import config from '../../Styles/config';
const { ThemeColors, FontFamily, Status, Image: Img, Authenticate } = config;

const Form = t.form.Form;

// Text Box
Form.stylesheet.textbox.normal = textbox.normal;
Form.stylesheet.textbox.error = textbox.error;
// We're overriding general textbox styles here to be able to later use a
// border on a textfield without the tcomb textboxView wrappers.
// However, also be able to use the wrapper's border on password fields.
Form.stylesheet.textbox.normal.borderBottomWidth = 0;
Form.stylesheet.textbox.error.borderBottomWidth = 0;

// Text Box View
Form.stylesheet.textboxView.normal.marginBottom = 25;
Form.stylesheet.textboxView.normal.borderColor = ThemeColors.text.primary;
Form.stylesheet.textboxView.error.borderColor = Status.error.border;
Form.stylesheet.textboxView.normal.borderWidth = 0;
Form.stylesheet.textboxView.error.borderWidth = 0;
Form.stylesheet.textboxView.normal.borderRadius = 0;
Form.stylesheet.textboxView.error.borderRadius = 0;
Form.stylesheet.textboxView.normal.borderBottomWidth = 1;
Form.stylesheet.textboxView.error.borderBottomWidth = 1;
Form.stylesheet.textboxView.normal.marginHorizontal = 0;
Form.stylesheet.textboxView.error.marginHorizontal = 0;

// Checkbox
Form.stylesheet.checkbox.normal.marginTop = 10;

// Blocks
Form.stylesheet.errorBlock.fontSize = 12;
Form.stylesheet.errorBlock.fontFamily = FontFamily.light;
Form.stylesheet.helpBlock.normal.fontSize = 12;
Form.stylesheet.helpBlock.error.fontSize = 12;

// Control Label
Form.stylesheet.controlLabel.normal = controlLabel.normal;
Form.stylesheet.controlLabel.error = controlLabel.error;

/**
 * Login Component
 */

class Login extends Component {
  constructor(props) {
    super(props);
    this.onLogInPress = this.onLogInPress.bind(this);
    this.onRegisterPress = this.onRegisterPress.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.viewTerms = this.viewTerms.bind(this);
    this.focusNextField = this.focusNextField.bind(this);

    /** passwordWithLocalBlacklist
     * This password check works similarly to the regular password check,
     * but with an additional blacklist. This prevents the user to choose
     * a password that is the value of other fields in the registration form,
     * @example: password can not be same as email.
     *           password can not be same as firstName or surName.
     */
    const passwordWithLocalBlacklist = t.refinement(t.String, (password) => {
      const fields = _.pick(this.state.registrationFormValues, ['email', 'firstName', 'surName']);
      const localBlackList = _.map(fields, (val, key) => val);
      const score = zxcvbn(password, _.concat(PwdBlackList, localBlackList)).score;
      return score >= 2;
    });

    this.state = {
      loginFormValues: {},
      registrationFormValues: {},

      loginData: t.struct({ email: FieldValidation.email, password: t.String }),

      registrationData: t.struct({
        firstName: t.String,
        surName: t.String,
        email: FieldValidation.email,
        password: passwordWithLocalBlacklist,
        acceptTOC: FieldValidation.checked
      })
    };
  }

  focusNextField(component) {
    if (component.refs.input != undefined) {
      component.refs.input.focus();
    }
  }

  componentWillMount() {
    this.options = {
      login: {
        auto: 'placeholders',
        order: ['email', 'password'],
        fields: {
          email: {
            label: 'Username',
            placeholder: 'Type your account number or email',
            placeholderTextColor: ThemeColors.text.label,
            error: 'Please enter your e-mail.',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              this.focusNextField(this.refs.loginForm.getComponent('password'));
            }
          },
          password: {
            label: 'Password',
            placeholder: 'Type your password',
            placeholderTextColor: ThemeColors.text.label,
            error: 'Please type your password.',
            secureTextEntry: true,
            returnKeyType: 'go'
          }
        }
      },
      register: {
        auto: 'placeholders',
        order: ['firstName', 'surName', 'email', 'password', 'acceptTOC'],
        fields: {
          firstName: {
            label: 'First name',
            placeholder: 'Type your first name',
            placeholderTextColor: ThemeColors.text.label,
            error: 'Please enter your first name.',
            keyboardType: 'default',
            autoCapitalize: 'words',
            autoCorrect: false,
            autoFocus: false,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              this.focusNextField(this.refs.registerForm.getComponent('surName'));
            }
          },
          surName: {
            label: 'Surname',
            placeholder: 'Type your surname',
            placeholderTextColor: ThemeColors.text.label,
            error: 'Please enter your surname.',
            keyboardType: 'default',
            autoCapitalize: 'words',
            autoCorrect: false,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              this.focusNextField(this.refs.registerForm.getComponent('email'));
            }
          },
          email: {
            label: 'Username',
            placeholder: 'Type your e-mail address',
            placeholderTextColor: ThemeColors.text.label,
            error: 'Please enter a valid e-mail.',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              this.focusNextField(this.refs.registerForm.getComponent('password'));
            }
          },
          password: {
            label: 'Password',
            placeholder: 'Type your new password',
            placeholderTextColor: ThemeColors.text.label,
            error: 'Please choose a secure password.',
            secureTextEntry: true, // This will work as default setting.
            returnKeyType: 'go',
            template: fn_PwdWithStrengthCheck,
            onSubmitEditing: () => {
              this.focusNextField(this.refs.registerForm.getComponent('acceptTOC'));
            }
          },
          acceptTOC: {
            label: 'Accept Terms & Conditions to use this service.',
            template: fn_SwitchWithLink,
            error: 'To register, you must accept these terms and conditions.',
            accessibilityLabel: 'Please accept these terms and conditions',
            onSubmitEditing: () => {
              this.focusNextField(this.refs.registerForm.getComponent('firstName'));
            }
          }
        }
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    // Fills in e-mail field of the login form, after a registration.
    // Clears passwords fields and registration form values.
    if (nextProps.session.successfullyRegisteredEmail) {
      this.setState({
        loginFormValues: {
          email: nextProps.session.successfullyRegisteredEmail
        },
        registrationFormValues: {}
      });
    }
  }

  onLogInPress() {
    // Retrieve credential results
    let creds = this.refs.loginForm.getValue();

    // Result (creds) is null unless valid
    if (creds) this.props.actions.login(creds);
  }

  onRegisterPress() {
    // Retrieve form results
    let data = this.refs.registerForm.getValue();

    // Result (data) is null unless valid
    if (data) {
      this.props.actions.register(data);
    }
  }

  toggleForm() {
    this.props.actions.toggleLoginForm();
    this.setState({ loginForm: !this.state.loginForm });
  }

  onChange(values) {
    // Updates state, setting new values from the form, to state.
    let st;
    if (this.props.focusLoginForm) {
      st = _.merge({}, this.state, {
        loginFormValues: _.merge({}, this.state.loginFormValues, values)
      });
    } else {
      st = _.merge({}, this.state, {
        registrationFormValues: _.merge({}, this.state.registrationFormValues, values)
      });
    }

    this.setState(st);
  }

  viewTerms() {
    this.props.navigation.navigate('TermsAndConditions');
  }

  render() {
    const buttonContent = (text) => {
      return this.props.session.processingRequest ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={buttonText}>{text}</Text>
      );
    };

    const loginForm = () => {
      return (
        <View style={[styles.section, styles.sectionCenter]}>
          <View style={styles.formOuter}>
            <Form
              ref="loginForm"
              type={this.state.loginData}
              options={this.options.login}
              value={this.state.loginFormValues}
              onChange={this.onChange}
            />
            <ServerError message={this.props.session.loginError} />
          </View>
        </View>
      );
    };

    const registrationForm = () => {
      return (
        <View style={styles.formOuter}>
          <Form
            ref="registerForm"
            type={this.state.registrationData}
            options={this.options.register}
            value={this.state.registrationFormValues}
            onChange={this.onChange}
          />
          <ServerError message={this.props.session.registrationError} />
        </View>
      );
    };

    const submitButton = (
      this.props.session.loginForm
        ? <Button style={button} onPress={this.onLogInPress}>{buttonContent('LOGIN')}</Button>
        : <Button style={button} onPress={this.onRegisterPress}>{buttonContent('CREATE ACCOUNT')}</Button>
    );

    const formSwitchLink = () => {
      let label = this.props.session.loginForm
        ? 'Create an account'
        : 'Already have an account? Login';
      return (
        <View style={styles.switchLink}>
          <TextLink onPress={this.toggleForm}>{label}</TextLink>
        </View>
      );
    };

    return (
      <ScrollView
        style={{ backgroundColor: Authenticate.bg }}
        contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.pageContent}>
          <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View style={[styles.section, styles.sectionStart]}>
              <View style={styles.logoPlaceholder}>
                <Image resizeMethod="scale" source={Img.logo.header} style={styles.logo} />
              </View>
            </View>
            <View style={styles.section}>
              {this.props.session.loginForm ? loginForm() : registrationForm()}
            </View>
            <View style={[styles.section, styles.sectionEnd]}>
              {submitButton}
              {formSwitchLink()}
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: ThemeColors.spatial.themeBackground
  },
  section: {
    width: '100%',
    flex: 1,
    justifyContent: 'center'
  },
  sectionStart: {
    justifyContent: 'flex-start',
    marginBottom: 35
  },
  sectionCenter: {
    justifyContent: 'center'
  },
  sectionEnd: {
    justifyContent: 'flex-end',
    marginBottom: 35
  },
  container: {
    flex: 1,
    paddingHorizontal: 30
  },
  sectionEnd: {
    justifyContent: 'flex-end',
    marginBottom: 35
  },
  container: {
    flex: 1,
    paddingHorizontal: 30
  },
  logoPlaceholder: {
    marginTop: 108,
    alignItems: 'center',
  },
  formOuter: {
    width: '100%'
  },
  switchLink: {
    alignItems: 'center'
  },
  logo: {
    resizeMode: 'contain',
    width: 238,
    height: 68,
  },
  link: {
    textAlign: 'center'
  }
});

export default Login;
