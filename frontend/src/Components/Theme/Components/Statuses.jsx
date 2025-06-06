import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import propTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    [theme.breakpoints.down('sm')]: {
      gap: 6
    }
  },
  status: {
    minWidth: 100,
    borderRadius: 20,
    padding: '5px 12px',
    color: '#fff',
    fontSize: 12,
    lineHeight: 1.1,
    opacity: 0.25,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      minWidth: 50,
      padding: '4px 12px',
      fontSize: 10
    }
  },
  active: {
    opacity: 1,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
  },
  NEW: {
    backgroundColor: '#EDC250'
  },
  AKO_TRANSFERRED: {
    backgroundColor: '#EDC250'
  },
  DRAFT: {
    backgroundColor: '#EDC250'
  },
  CANCELED_BY_OWNER: {
    backgroundColor: '#FF0000'
  },
  CANCELED_BY_CONCURRENT: {
    backgroundColor: '#FF0000'
  },
  CANCELED: {
    backgroundColor: '#FF0000'
  },
  AKO_CANCELED: {
    backgroundColor: '#FF0000'
  },
  REJECTED: {
    backgroundColor: '#A82E26'
  },
  IN_PROCESS: {
    backgroundColor: '#223B82'
  },
  FORMED: {
    backgroundColor: '#F28C60'
  },
  REPROCESSING: {
    backgroundColor: '#F28C60'
  },
  DONE: {
    backgroundColor: '#018C0D'
  },
  RESOLVED: {
    backgroundColor: '#018C0D'
  },
  AKO_PROCESSED: {
    backgroundColor: '#018C0D'
  },
  COMPLETED: {
    backgroundColor: '#539489'
  },
  PARTIALLY_DONE: {
    backgroundColor: '#6C7D9A'
  },
  PROCESSED: {
    backgroundColor: '#6C7D9A'
  },
  AKO_IN_PROCESS: {
    backgroundColor: '#6C7D9A'
  }
}));

export const getName = (status, t) => {
  switch (status) {
    case 'DRAFT':
      return t('STATUSES.DRAFT');

    case 'NEW':
      return t('STATUSES.NEW');

    case 'IN_PROCESS':
      return t('STATUSES.IN_PROCESS');

    case 'PROCESSED':
      return t('STATUSES.PROCESSED');

    case 'REPROCESSING':
      return t('STATUSES.REPROCESSING');

    case 'DONE':
      return t('STATUSES.DONE');

    case 'CANCELED':
    case 'CANCELED_BY_OWNER':
    case 'CANCELED_BY_CONCURRENT':
      return t('STATUSES.CANCELED');

    case 'REJECTED':
      return t('STATUSES.REJECTED');

    case 'FORMED':
      return t('STATUSES.FORMED');

    case 'PARTIALLY_DONE':
      return t('STATUSES.PARTIALLY_DONE');

    case 'RESOLVED':
      return t('STATUSES.RESOLVED');

    case 'COMPLETED':
      return t('STATUSES.COMPLETED');

    case 'AKO_TRANSFERRED':
      return t('STATUSES.AKO_TRANSFERRED');

    case 'AKO_IN_PROCESS':
      return t('STATUSES.AKO_IN_PROCESS');

    case 'AKO_PROCESSED':
      return t('STATUSES.AKO_PROCESSED');

    case 'AKO_CANCELED':
      return t('STATUSES.AKO_CANCELED');

    default:
      return t('STATUSES.NEW');
  }
};

const Statuses = ({ statuses, currentStatus }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      {statuses.map((status) => (
        <div
          className={clsx(classes.status, classes[status], currentStatus?.startsWith(status) && classes.active)}
          key={status}
          data-marker={'status__' + status}
          data-status={currentStatus?.startsWith(status) ? 'active' : 'disabled'}
        >
          {getName(status, t)}
        </div>
      ))}
    </div>
  );
};

Statuses.propTypes = {
  statuses: propTypes.arrayOf(
    propTypes.oneOf([
      'NEW',
      'IN_PROCESS',
      'DONE',
      'DRAFT',
      'PARTIALLY_DONE',
      'CANCELED',
      'CANCELED_BY_OWNER',
      'CANCELED_BY_CONCURRENT',
      'REJECTED',
      'FORMED',
      'COMPLETED',
      'PROCESSED',
      'REPROCESSING',
      'RESOLVED',
      'AKO_TRANSFERRED',
      'AKO_IN_PROCESS',
      'AKO_PROCESSED',
      'AKO_CANCELED'
    ])
  ),
  currentStatus: propTypes.oneOf([
    '',
    'NEW',
    'IN_PROCESS',
    'DONE',
    'DRAFT',
    'PARTIALLY_DONE',
    'CANCELED',
    'CANCELED_BY_OWNER',
    'CANCELED_BY_CONCURRENT',
    'REJECTED',
    'FORMED',
    'COMPLETED',
    'PROCESSED',
    'REPROCESSING',
    'RESOLVED',
    'AKO_TRANSFERRED',
    'AKO_IN_PROCESS',
    'AKO_PROCESSED',
    'AKO_CANCELED'
  ])
};

export default Statuses;
