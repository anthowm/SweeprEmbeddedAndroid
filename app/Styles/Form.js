import Config from 'react-native-config';
import config from './config';

const { ThemeColors, FontFamily, Status, Buttons } = config;

export const textbox = {
  normal: {
    backgroundColor: 'transparent',
    color: ThemeColors.text.primary,
    borderColor: ThemeColors.text.primary,
    borderRadius: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    fontSize: 14,
    fontFamily: FontFamily.light,
    height: 40,
    marginBottom: 0,
    paddingHorizontal: 0,
    paddingTop: 0
  },
  error: {
    backgroundColor: 'transparent',
    color: Status.error.text,
    borderColor: Status.error.border,
    borderRadius: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    fontSize: 14,
    fontFamily: FontFamily.light,
    height: 40,
    marginBottom: 0,
    paddingHorizontal: 0,
    paddingTop: 0
  }
};

export const controlLabel = {
  normal: {
    color: ThemeColors.text.primary,
    fontSize: 14,
    fontFamily: FontFamily.light,
    marginBottom: 0
  },
  error: {
    color: Status.error.text,
    fontSize: 14,
    fontFamily: FontFamily.light,
    marginBottom: 0
  }
};

export const button = {
  backgroundColor: Buttons.primary.bg,
  borderWidth: 0,
  borderRadius: 0,
  paddingVertical: 8
};

export const buttonText = {
  fontFamily: FontFamily.regular,
  color: Buttons.primary.text,
  fontSize: 15
};

export const button_secondary = {
  backgroundColor: Buttons.secondary.bg,
  borderWidth: 0,
  borderRadius: 0,
  paddingVertical: 8
};

export const buttonText_secondary = {
  fontFamily: FontFamily.regular,
  color: Buttons.secondary.text,
  fontSize: 15
};

export const link = {
  color: ThemeColors.text.primary,
  textDecorationLine: 'underline',
  paddingBottom: 15
};
