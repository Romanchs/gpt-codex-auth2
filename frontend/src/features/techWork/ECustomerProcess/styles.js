import { themeV5 as theme } from '../../../theme/themeV5';

const styles = {
  table: {
    mb: 2,
    borderRadius: 2,
    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)'
  },
  header: {
    color: '#FFFFFF',
    padding: '17px 24px',
    fontSize: 12,
    fontWeight: 400,
    backgroundColor: '#223B82',
    borderRadius: '8px 8px 0px 0px'
  },
  body: {
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    backgroundColor: '#fff',
    padding: theme.spacing(2, 13, 1.5, 3),
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2, 3, 8, 3)
    }
  },
  settingElement: {
    display: 'flex',
    alignItems: 'center'
  },
  saveButton: {
    position: 'absolute',
    right: 28,
    bottom: 12,
    '&:first-child': {
      display: 'block',
      height: 40
    }
  }
};

export default styles;
