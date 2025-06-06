import { StyledTable } from '../../../Theme/Table/StyledTable';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, TableCell } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Status from '../Main/Status';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { useState } from 'react';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { DangerButton } from '../../../Theme/Buttons/DangerButton';
import { WhiteButton } from '../../../Theme/Buttons/WhiteButton';
import { handleSelect } from '../../../../actions/suppliersActions';
import clsx from 'clsx';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Table = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selected, selectedErrors } = useSelector(({ suppliers }) => suppliers);
  const [deleteSupplier, setDeleteSupplier] = useState(null);

  const handleDelete = () => {
    dispatch(handleSelect(deleteSupplier));
    setDeleteSupplier(null);
  };

  return (
    <>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 120 }}>{t('FIELDS.STATUS')}</TableCell>
            <TableCell style={{ width: 120 }}>{t('FIELDS.USREOU')}</TableCell>
            <TableCell>{t('FIELDS.NAME_OF_COMPANY')}</TableCell>
            <TableCell style={{ width: 40 }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selected.map((supplier) => (
            <Row
              key={supplier.uid}
              {...supplier}
              handleDelete={() => setDeleteSupplier(supplier)}
              error={
                typeof selectedErrors.find((i) => i?.party_register_uid === supplier.uid)?.detail?.detail === 'string'
                  ? selectedErrors.find((i) => i?.party_register_uid === supplier.uid)?.detail?.detail
                  : selectedErrors.find((i) => i?.party_register_uid === supplier.uid)?.detail.join(', ')
              }
            />
          ))}
        </TableBody>
      </StyledTable>
      <ModalWrapper
        open={Boolean(deleteSupplier)}
        onClose={() => setDeleteSupplier(null)}
        header={t('SUPPLIERS.REMOVE_SELECTED_SUPPLIER', { name: deleteSupplier?.full_name })}
        maxWidth={'sm'}
      >
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
          <WhiteButton onClick={() => setDeleteSupplier(null)}>{t('CONTROLS.NO')}</WhiteButton>
          <DangerButton onClick={handleDelete}>{t('CONTROLS.YES')}</DangerButton>
        </Stack>
      </ModalWrapper>
    </>
  );
};

export default Table;

const Row = ({ full_name, status, usreou, handleDelete, error }) => {
  const { t } = useTranslation();
  const cls = useErrorStyles();
  return (
    <>
      <TableRow data-marker="table-row" className={clsx('body__table-row', error && cls.error)}>
        <TableCell>
          <Status status={status} />
        </TableCell>
        <TableCell>{usreou}</TableCell>
        <TableCell>{full_name}</TableCell>
        <TableCell>
          <CircleButton type={'delete'} title={t('CONTROLS.DELETE')} onClick={handleDelete} size={'small'} />
        </TableCell>
      </TableRow>
      {error && (
        <TableRow>
          <TableCell colSpan={4} style={{ color: 'red', paddingTop: 0, paddingBottom: 8, border: 'none' }}>
            {error}
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const useErrorStyles = makeStyles(() => ({
  error: {
    '& > *': {
      borderColor: 'red !important'
    }
  }
}));
