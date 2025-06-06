import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import TableSelect from '../../../Tables/TableSelect';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import DatePicker from '../../../Theme/Fields/DatePicker';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useRegTabStyles } from '../filterStyles';
import WarningRounded from '@mui/icons-material/WarningRounded';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'end_date', label: 'FIELDS.DOWNLOAD_DATETIME', minWidth: 180 },
  { id: 'name', label: 'FIELDS.FILENAME', minWidth: 150, value: 'name_display' },
  { id: 'file_download', label: 'FIELDS.FILE_DOWNLOADED', minWidth: 50 },
  { id: 'version', label: 'FIELDS.VERSION', minWidth: 110 },
  { id: 'period_from', label: 'FIELDS.PERIOD_FROM', minWidth: 80 },
  { id: 'period_to', label: 'FIELDS.PERIOD_TO', minWidth: 80 },
  { id: 'result', label: 'FIELDS.FILE_RETURN_CODES', minWidth: 100 },
  { id: 'download', label: 'CONTROLS.DOWNLOAD', minWidth: 50 },
  { id: 'send_MMS', label: 'CONTROLS.SEND_MMS', minWidth: 120 }
];

const FilesTab = () => {
  const { t } = useTranslation();
  const classes = useRegTabStyles();
  const data = [
    {
      end_date: '11.11.2022 15:13',
      name: 'ДКО.xml',
      file_download: 'Tak',
      version: 1,
      period_from: '10.10.2022',
      period_to: '11.11.2022',
      status_label: t('PROCESSING_ERROR'),
      status: 'IN_PROGRESS'
    }
  ];

  const onSearch = (key, value) => {};

  const resultData = (row) => {
    if (row?.name === 'AGGREGATE_DATA_BY_GROUP_A') {
      return '-';
    }
    if (row?.status === 'DONE' || row?.status === 'PARTIALLY_DONE') {
      return `${row?.success_files}/${row?.all_files}`;
    }
    if (row?.status !== 'NEW') {
      return (
        <LightTooltip
          title={row?.status_label || t('PROCESSING_ERROR')}
          arrow
          disableTouchListener
          disableFocusListener
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
      );
    }
    return '-';
  };

  const getData = (id, value, row) => {
    if (id === 'started_at' || id === 'finished_at') {
      return (
        <TableCell data-marker={id} key={'cell' + id}>
          {value && moment(value).format('DD.MM.yyyy • HH:mm')}
        </TableCell>
      );
    }
    if (id === 'period_from' || id === 'period_to') {
      return (
        <TableCell data-marker={id} key={'cell' + id}>
          {value && moment(value).format('DD.MM.yyyy')}
        </TableCell>
      );
    }
    if (id === 'result') {
      return (
        <TableCell data-marker={id} key={'cell' + id} align={'center'}>
          {resultData(row)}
        </TableCell>
      );
    }
    if (id === 'download') {
      return (
        <TableCell data-marker={id} key={'cell' + id} align={'center'}>
          <CircleButton type={'download'} title={t('CONTROLS.DOWNLOAD')} />
        </TableCell>
      );
    }
    if (id === 'send_MMS') {
      return (
        <TableCell data-marker={id} key={'cell' + id} align={'center'}>
          <CircleButton type={'send'} title={t('CONTROLS.SEND_MMS')} />
        </TableCell>
      );
    }
    return (
      <TableCell data-marker={id} key={'cell' + id}>
        {value || '-'}
      </TableCell>
    );
  };

  const getSearchField = (id) => {
    switch (id) {
      case 'result':
      case 'download':
      case 'send_MMS':
        return null;
      case 'file_download':
        return (
          <TableSelect
            value={''}
            data={[
              { label: t('CONTROLS.YES'), value: 1 },
              { label: t('CONTROLS.NO'), value: 2 }
            ]}
            id={'file_download'}
            minWidth={80}
            onChange={onSearch}
          />
        );
      case 'end_date':
      case 'period_from':
      case 'period_to':
        return (
          <div className={classes.picker}>
            <DatePicker
              label={''}
              value={''}
              id={id}
              onChange={(value) => onSearch(id, moment(value).format('YYYY-MM-DD'))}
              minWidth={80}
            />
          </div>
        );
      default:
        return <input value={''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={id}>
                <p>{t(label)}</p>
                {getSearchField(id)}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.length > 0 ? (
            data?.map((row, index) => (
              <TableRow
                key={'row' + index}
                hover
                data-marker="table-row"
                className="body__table-row"
                onClick={() => history.push(`process-manager/${row.uid}`)}
              >
                {columns.map(({ id, value }) => getData(id, value ? row[value] : row[id], row))}
              </TableRow>
            ))
          ) : (
            <NotResultRow span={8} text={t('NOTHING_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination data={data} params={{}} onPaginate={() => {}} />
    </>
  );
};

export default FilesTab;
