import { themeV5 as theme } from '../../../theme/themeV5';

const styles = {
  root: {
    marginTop: 3,
    maxWidth: '1380px !important',
    [theme.breakpoints.down('sm')]: {
      marginTop: 1.5
    },
    '& p': {
      color: '#223B82',
      fontSize: 24,
      fontWeight: 300,
      marginBottom: 0.5,
      lineHeight: 1.4,
      [theme.breakpoints.down('sm')]: {
        fontSize: 18,
        marginBottom: 0.5
      }
    }
  },
  logo: {
    '& svg': {
      height: 82,
      marginRight: 3.5,
      [theme.breakpoints.down('sm')]: {
        height: 64,
        marginRight: 1.75
      },
      [theme.breakpoints.down('xs')]: {
        marginRight: 1.75,
        marginBottom: 1.5
      }
    }
  },
  header: {
    '&>h3': {
      color: '#A97278',
      fontSize: 52,
      lineHeight: 1,
      fontWeight: 700,
      [theme.breakpoints.down('sm')]: {
        fontSize: 36
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 26
      },
      '&>span': {
        color: '#223B82'
      }
    }
  },
  block: {
    padding: '28px 16px 22px',
    cursor: 'pointer',
    textAlign: 'center',
    height: '100%',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    borderRadius: '8px',
    position: 'relative',
    '&>svg': {
      fontSize: 48,
      color: '#F28C60'
    },
    '&>h4': {
      fontSize: 16,
      textTransform: 'uppercase',
      color: '#223B82',
      marginTop: 1.5,
      marginBottom: 1.5
    },
    '&>p': {
      fontSize: 12,
      color: '#6A869F'
    }
  }
};

export default styles;
