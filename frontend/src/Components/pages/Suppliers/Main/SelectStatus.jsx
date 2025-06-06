import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { Button, darken, Grid, makeStyles } from '@material-ui/core';
import AssignmentTurnedInRounded from '@mui/icons-material/AssignmentTurnedInRounded';
import WorkRounded from '@mui/icons-material/WorkRounded';
import WorkOffRounded from '@mui/icons-material/WorkOffRounded';
import NotInterestedRounded from '@mui/icons-material/NotInterestedRounded';
import { supplierStatuses as statuses } from './models';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {useTranslation} from "react-i18next";

const SelectStatus = ({ open, onClose, status }) => {
  const {t} = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const can_default = useSelector(({ suppliers }) => suppliers.selected.length === 1);

  return (
    <ModalWrapper open={open} onClose={onClose} header={t('STATUSES.TRANSFER_TO_STATUSES')} maxWidth={'sm'}>
      <Grid container spacing={2} className={classes.root}>
        {(status === statuses.PRE_DEFAULT.value ||
          status === statuses.DEFAULT.value ||
          status === statuses.NOT_ACTIVE.value) && (
          <Grid item xs={12}>
            <Button className={classes.active} onClick={() => navigate(`/suppliers/transfer/${statuses.ACTIVE.value}`)}>
              <AssignmentTurnedInRounded />
              {t(statuses.ACTIVE.label)}
            </Button>
          </Grid>
        )}
        {(status === statuses.ACTIVE.value || status === statuses.PRE_DEFAULT.value) && (
          <Grid item xs={12}>
            <Button
              className={classes.preDefault}
              onClick={() => navigate(`/suppliers/transfer/${statuses.PRE_DEFAULT.value}`)}
            >
              <WorkRounded />
              {t(statuses.PRE_DEFAULT.label)}
            </Button>
          </Grid>
        )}
        {(status === statuses.ACTIVE.value || status === statuses.PRE_DEFAULT.value) && can_default && (
          <Grid item xs={12}>
            <Button
              className={classes.default}
              onClick={() => navigate(`/suppliers/transfer/${statuses.DEFAULT.value}`)}
            >
              <WorkOffRounded />
              {t(statuses.DEFAULT.label)}
            </Button>
          </Grid>
        )}
        {status === statuses.DEFAULT.value && (
          <Grid item xs={12}>
            <Button
              className={classes.notActive}
              onClick={() => navigate(`/suppliers/transfer/${statuses.NOT_ACTIVE.value}`)}
            >
              <NotInterestedRounded />
              {t(statuses.NOT_ACTIVE.label)}
            </Button>
          </Grid>
        )}
      </Grid>
    </ModalWrapper>
  );
};

export default SelectStatus;

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 16,
    '& button': {
      width: '100%',
      color: 'white',
      lineHeight: '22px',
      '& svg': {
        fontSize: 14,
        marginRight: 8
      }
    }
  },
  active: {
    backgroundColor: '#018C0D',
    '&:hover, &:active': {
      backgroundColor: darken('#018C0D', 0.2)
    }
  },
  preDefault: {
    backgroundColor: '#F28C60',
    '&:hover, &:active': {
      backgroundColor: darken('#F28C60', 0.2)
    }
  },
  default: {
    backgroundColor: '#FF0000',
    '&:hover, &:active': {
      backgroundColor: darken('#FF0000', 0.2)
    }
  },
  notActive: {
    backgroundColor: '#A5A2A3',
    '&:hover, &:active': {
      backgroundColor: darken('#A5A2A3', 0.2)
    }
  }
}));
