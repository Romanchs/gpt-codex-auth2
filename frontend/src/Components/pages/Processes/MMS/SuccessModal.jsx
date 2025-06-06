import { useDispatch, useSelector } from 'react-redux';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { mmsCloseSuccessDialog } from '../../../../actions/mmsActions';
import { makeStyles } from '@material-ui/core';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  table: {
    marginTop: 16,
    borderSpacing: 0,
    '& *': {
      color: '#6C7D9A',
      fontSize: 12
    },
    '& th, td': {
      padding: 8,
      minWidth: 250,
      textAlign: 'left',
      borderBottom: '1px solid rgba(34, 59, 130, 0.25)'
    },
    '& th': {
      fontWeight: 'normal'
    },
    '& td': {
      fontWeight: 'bold'
    },
    '& tr:last-child > td': {
      borderBottom: 'none'
    }
  }
}));

const SuccessModal = () => {
  const {t} = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { successModal } = useSelector(({ mms }) => mms);

  const handleClose = () => {
    dispatch(mmsCloseSuccessDialog());
  };

  return (
    <ModalWrapper
      open={Boolean(successModal)}
      header={t('IMPORT_FILE.IMPORT_FILE_SUCCESS', {name: successModal?.file_name})}
      onClose={handleClose}
      maxWidth={'lg'}
    >
      <table className={classes.table}>
        <thead>
          <tr>
            <th>{t('FIELDS.EIC_CODE_ZV_TKO')}</th>
            <th>{t('FIELDS.ACTIVE_ENERGY_IN')}</th>
            <th>{t('FIELDS.ACTIVE_ENERGY_OUT')}</th>
          </tr>
        </thead>
        <tbody>
          {successModal?.data?.map(({ zv_eic = '', in_quantity = 0, out_quantity = 0 }, index) => (
            <tr key={zv_eic + index}>
              <th>{zv_eic}</th>
              <td>{in_quantity}</td>
              <td>{out_quantity}</td>
            </tr>
          ))}
          <tr>
            <td>{t('FIELDS.TOTAL_COUNT')}:</td>
            <td>{successModal?.data?.map((i) => i.in_quantity).reduce((a, b) => a + b)}</td>
            <td>{successModal?.data?.map((i) => i.out_quantity).reduce((a, b) => a + b)}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <BlueButton onClick={handleClose}>{t('CONTROLS.CONTINUE')}</BlueButton>
      </div>
    </ModalWrapper>
  );
};

export default SuccessModal;
