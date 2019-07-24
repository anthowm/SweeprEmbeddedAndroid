import config from './config';
const { ThemeColors, FontFamily, Status } = config;

/** Titles
 *
 */

export const Titles = {
  magnificent: {
    fontFamily: FontFamily.bold,
    color: ThemeColors.text.featured,
    fontSize: 30,
    lineHeight: 34,
    paddingTop: 10,
    paddingBottom: 10
  },
  main: {
    fontFamily: FontFamily.bold,
    color: ThemeColors.text.primary,
    fontSize: 25,
    marginBottom: 5
  },
  secondary: {
    fontFamily: FontFamily.bold,
    color: ThemeColors.text.primary,
    fontSize: 20,
    marginBottom: 5
  },
  tertiary: {
    fontFamily: FontFamily.regular,
    color: ThemeColors.text.featured,
    fontSize: 20,
    marginBottom: 5
  },
  header: {
    fontFamily: FontFamily.regular,
    color: ThemeColors.text.featured,
    fontSize: 20,
    marginTop: 5
  },
  sub: {
    fontFamily: FontFamily.light,
    color: ThemeColors.text.label,
    fontSize: 20,
  },
  route: {
    fontFamily: FontFamily.regular,
    color: ThemeColors.text.featured,
    textAlign: 'center',
    lineHeight: 50,
    fontSize: 20,
    backgroundColor: 'transparent'
  }
};

export const Paragraphs = {
  standard: {
    fontFamily: FontFamily.regular,
    fontSize: 16
  },
  placeholder: {
    fontFamily: FontFamily.regular,
    color: Status.text.inactive
  },
  error: {
    fontFamily: FontFamily.regular,
    color: Status.error.text2,
  }
};
