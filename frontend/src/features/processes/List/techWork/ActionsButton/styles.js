import { themeV5 as theme } from '../../../../../theme/themeV5';

export const actionsButtonStyles = {
  buttonStyles: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    boxShadow: '0px 4px 12px 0px #00000026'
  },
  icon: {
    width: 16,
    height: 16
  },
  menuItem: {
    gap: 1,
    p: theme.spacing(1, 1.5),
    '& svg': {
      height: 16,
      width: 16
    }
  },
  green: {
    color: '#008C0C'
  },
  red: {
    color: '#FF0000'
  },
  orange: {
    color: '#F28C60'
  },
  grey: {
    color: '#567691'
  }
};
