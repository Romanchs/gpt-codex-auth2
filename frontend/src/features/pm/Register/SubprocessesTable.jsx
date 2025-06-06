import WarningRounded from '@mui/icons-material/WarningRounded';
import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const SubprocessesTable = ({ list }) => {
  const { t } = useTranslation();

  const getStatus = (row) => {
    if (row?.status === 'NEW' || row?.status === 'IN_PROCESS' || row?.status === 'DONE') {
      return (
        <TableCell style={{ width: 100 }} className={'MuiTableCell-head'} align={'center'}>
          <Typography style={{ fontWeight: 500, color: row.progress < 50 ? 'red' : 'green' }}>
            {row.percent_completed}%
          </Typography>
        </TableCell>
      );
    }
    return (
      <TableCell style={{ width: 100 }} className={'MuiTableCell-head'} align={'center'}>
        <LightTooltip
          title={row?.status_label || t('PROCESSING_ERROR')}
          disableTouchListener
          disableFocusListener
          arrow
        >
          <WarningRounded
            data-marker={'error'}
            style={{
              color: '#f90000',
              fontSize: 22,
              cursor: 'pointer'
            }}
          />
        </LightTooltip>
      </TableCell>
    );
  };

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          <TableCell className={'MuiTableCell-head'}>{t('SUBPROCES')}</TableCell>
          <TableCell style={{ width: 100 }} className={'MuiTableCell-head'}>
            {t('PROGRES')}
          </TableCell>
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {list?.length > 0 ? (
          list?.map((row, index) => (
            <TableRow key={'row' + index} hover data-marker="table-row" className="body__table-row">
              <TableCell className={'MuiTableCell-head'}>{row.name}</TableCell>
              {getStatus(row)}
            </TableRow>
          ))
        ) : (
          <NotResultRow span={2} text={t('NOTHING_FOUND')} />
        )}
      </TableBody>
    </StyledTable>
  );
};

export default SubprocessesTable;
