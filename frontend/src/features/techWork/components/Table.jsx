import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import { useState } from 'react';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { CancelModal, CompleteModal } from './Modals';
import { useMaintenanceByIdMutation } from '../api';
import { useTranslation } from 'react-i18next';
import Row from './Row';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const Table = ({ data }) => {
  const { t } = useTranslation();
  const [modalData, setModalData] = useState(null);
  const isComplete = modalData?.status === 'ACTIVE';
  const Modal = isComplete ? CompleteModal : CancelModal;
  const [update] = useMaintenanceByIdMutation({ fixedCacheKey: 'Maintenance_update' });

  const handleClose = () => {
    setModalData(null);
  };

  const handleSubmit = ({ notify, todolist }) => {
    const data = {
      uid: modalData?.id,
      type: 'cancel',
      body: { notify }
    };
    if (isComplete) {
      data.type = 'complete';
      data.body.todolist = todolist;
    }
    update(data);
  };

  return (
    <>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            <TableCell className={'MuiTableCell-head'}></TableCell>
            <TableCell className={'MuiTableCell-head'}>{t('TECH_WORKS.TABLE.ID')}</TableCell>
            <TableCell className={'MuiTableCell-head'} align={'center'}>
              {t('TECH_WORKS.TABLE.TYPE')}
            </TableCell>
            <TableCell sx={{ width: 200 }} className={'MuiTableCell-head'} align={'center'}>
              {t('TECH_WORKS.TABLE.STATUS')}
            </TableCell>
            <TableCell className={'MuiTableCell-head'} align={'center'}>
              {t('TECH_WORKS.TABLE.START_DT')}
            </TableCell>
            <TableCell className={'MuiTableCell-head'} align={'center'}>
              {t('TECH_WORKS.TABLE.PLANNED_END_DT')}
            </TableCell>
            <TableCell className={'MuiTableCell-head'}></TableCell>
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.length > 0 ? (
            data?.map((row) => <Row key={`row-${row?.id}`} data={row} handleClick={setModalData} />)
          ) : (
            <NotResultRow span={7} text={t('TECH_WORKS.TABLE.NO_ITEMS_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Modal open={Boolean(modalData)} list={modalData?.todolist} onClose={handleClose} onSubmit={handleSubmit} />
    </>
  );
};

export default Table;
