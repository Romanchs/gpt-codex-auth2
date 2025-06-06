import { themeV5 as theme } from '../../../../theme/themeV5';

export const detailsTabStyles = {
  rolesBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  rolesBoxTitle: {
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 1.125,
    color: '#0D244D',
    p: theme.spacing(2, 3)
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    p: theme.spacing(2, 3),
    gap: 9,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 3
    }
  },
  checkboxElement: {
    display: 'flex',
    gap: 1.5,
    alignItems: 'center'
  }
};
