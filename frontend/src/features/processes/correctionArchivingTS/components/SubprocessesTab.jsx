import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import NotResultRow from '../../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../../Components/Theme/Table/StyledTable';
import TableHeadCell from '../../../../Components/Tables/TableHeadCell';
import { useSubprocessesCorrectionArchivingTSQuery } from '../api';
import StickyTableHead from '../../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'subprocess_id', label: 'FIELDS.SUBPROCESS_ID' },
  { id: 'name', label: 'FIELDS.SUBPROCESS_NAME' },
  { id: 'answer', label: 'DONE' },
  { id: 'taken_at', label: 'FIELDS.INITIALIZATION_DATE' },
  { id: 'done_at', label: 'FIELDS.DONE_DATETIME' }
];

const SubprocessesTab = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const { currentData } = useSubprocessesCorrectionArchivingTSQuery(uid, { skip: !uid });

  const getData = (id, value) => {
    if (id === 'taken_at' || id === 'done_at') {
      return value ? moment(value).format('DD.MM.yyyy • HH:mm') : '–';
    }
    if (id === 'name') {
      return value && value === 'Запит на коригування ДКО'
        ? t('SUBPROCESSES.REQUEST_CORRECTION_TS')
        : t('SUBPROCESSES.REQUEST_ARCHIVING_TS');
    }
    if (id === 'answer') {
      return (
        <Box
          component={'span'}
          className={value?.toLowerCase() === 'так' ? 'success' : 'danger'}
          sx={{
            p: '5px 27px',
            borderRadius: 6,
            bgcolor: '#D1EDF37D'
          }}
        >
          {value?.toLowerCase() === 'так' ? t('CONTROLS.YES') : t('CONTROLS.NO')}
        </Box>
      );
    }
    return value;
  };

  return (
    <StyledTable spacing={2}>
      <StickyTableHead>
        <TableRow>
          {columns.map(({ id, label }) => (
            <TableHeadCell key={id} title={t(label)} />
          ))}
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {!currentData?.subprocesses?.length ? (
          <NotResultRow span={columns.length} text={t('NO_RECORDS_FOUND')} />
        ) : (
          <>
            {currentData?.subprocesses?.map((point) => (
              <TableRow key={`row-${point.subprocess_id}`} className={'body__table-row'} data-marker={'table-row'}>
                {columns.map(({ id }) => (
                  <TableCell key={id + point.subprocess_id} data-marker={id}>
                    {getData(id, point[id])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </StyledTable>
  );
};

export default SubprocessesTab;
