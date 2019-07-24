import config from './config';
const { ThemeColors } = config;

export const Borders = {
  bottom: {
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border.item
  },
  top: {
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border.item
  }
};
