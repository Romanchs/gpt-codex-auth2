import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import WarningRounded from '@mui/icons-material/WarningRounded';
import ArchiveRounded from '@mui/icons-material/ArchiveRounded';
import { useEffect, useRef, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { LightTooltip } from '../../Components/Theme/Components/LightTooltip';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import TableSelect from '../../Components/Tables/TableSelect';
import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import { useGetDataReportsQuery } from './api';
import DatePicker from '../../Components/Theme/Fields/DatePicker';
import { useLazyMsFilesDownloadQuery } from '../../app/mainApi';
import { useTranslation } from 'react-i18next';
import useViewLog from '../../services/actionsLog/useViewLog';
import useViewCallbackLog from '../../services/actionsLog/useViewCallbackLog';
import useSearchLog from '../../services/actionsLog/useSearchLog';
import useExportFileLog from '../../services/actionsLog/useEportFileLog';

const columns = [
  { id: 'report_name', label: 'FIELDS.REPORT_NAME', minWidth: 450 },
  { id: 'company', label: 'FIELDS.COMPANY_INITIATOR', minWidth: 200 },
  { id: 'user', label: 'FIELDS.USER_INITIATOR', minWidth: 120 },
  { id: 'created_at', label: 'FIELDS.DATE_OF_FORMATION', minWidth: 150 },
  {
    id: 'archive',
    label: 'FIELDS.REPORT_STATUS',
    minWidth: 120,
    renderBody: (archive) => (archive ? 'ARCHIVES' : 'ACTIVE')
  }
];

const FormedReportsTab = ({ params, setParams }) => {
  const { t, i18n } = useTranslation();
  const timeout = useRef(null);
  const [search, setSearch] = useState(params);
  const { data: files, isFetching, refetch } = useGetDataReportsQuery({ tab: 'files', params });
  const exportFileLog = useExportFileLog(['Звіти']);
  const [donwloadReport] = useLazyMsFilesDownloadQuery();
  const classes = useDatePickerStyles();
  const viewLog = useViewLog();
  const onPaginateLog = useViewCallbackLog();
  const serchLog = useSearchLog();

  useEffect(() => viewLog(), [viewLog]);

  const handleDownload = ({ file_id, file_name }) => {
    donwloadReport({ id: file_id, name: file_name });
    exportFileLog();
  };

  const onSearch = (id, value) => {
    if (!value) value = '';
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams({ ...params, ...search, [id]: value, page: 1 });
      serchLog();
    }, 500);
  };

  const getSearch = (key) => {
    if (key === 'created_at') {
      return (
        <div className={classes.picker}>
          <DatePicker
            label={''}
            value={search[key] || null}
            id={key}
            onChange={(value) => onSearch(key, value)}
            minWidth={80}
            outFormat={'YYYY-MM-DD'}
          />
        </div>
      );
    }
    if (key === 'archive') {
      return (
        <TableSelect
          value={search[key] || null}
          column={{ id: key }}
          data={[
            { label: t('ARCHIVES'), value: 'true' },
            { label: t('ACTIVE'), value: 'false' }
          ]}
          id={key}
          onChange={onSearch}
          minWidth={120}
        />
      );
    }
    return <input type="text" value={search[key] || ''} onChange={({ target }) => onSearch(key, target.value)} />;
  };

  return (
    <>
      <StyledTable>
        <TableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell key={`reportHeadCell-${id}`} style={{ minWidth }}>
                <p>{t(label)}</p>
                {getSearch(id)}
              </TableCell>
            ))}
            <TableCell style={{ minWidth: 50 }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files?.data?.length > 0 ? (
            files?.data?.map((report, index) => (
              <TableRow
                tabIndex={-1}
                data-marker="table-row"
                className="body__table-row"
                key={`${report?.file_id}-${index}`}
              >
                {columns.map(({ id, renderBody }) =>
                  id === 'report_name' ? (
                    <TableCell key={id} align={'left'} data-marker={id}>
                      {report?.[`report_${i18n.language}`]}
                    </TableCell>
                  ) : (
                    <TableCell key={id} align={'left'} data-marker={id}>
                      {renderBody ? t(renderBody(report?.[id])) : report?.[id]}
                    </TableCell>
                  )
                )}
                <TableCell align={'center'}>
                  <StatusIcon data={report} handleDownload={handleDownload} handleUpdate={refetch} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <NotResultRow span={columns.length + 1} text={t('THERE_ARE_NO_REPORTS_FOR_YOUR_ROLE')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...files}
        loading={isFetching}
        params={params}
        onPaginate={(v) => {
          setParams({ ...params, ...v });
          onPaginateLog();
        }}
      />
    </>
  );
};

export default FormedReportsTab;

const StatusIcon = ({ data, handleDownload, handleUpdate }) => {
  const { t } = useTranslation();
  if (data?.status === 'DONE') {
    if (data?.archive) {
      return (
        <LightTooltip
          title={t('CONTROLS.DOWNLOAD_REPORT')}
          arrow
          disableTouchListener
          disableFocusListener
          onClick={() => handleDownload(data)}
        >
          <ArchiveRounded
            data-marker={'download-archive'}
            style={{
              color: '#567691',
              fontSize: 24,
              cursor: 'pointer'
            }}
          />
        </LightTooltip>
      );
    }
    return (
      <CircleButton
        type={'download'}
        size={'small'}
        title={t('CONTROLS.DOWNLOAD_REPORT')}
        onClick={() => handleDownload(data)}
      />
    );
  }
  if (data?.status === 'IN_PROCESS') {
    return <CircleButton type={'loading'} size={'small'} title={`${t('FORMATTING_FILE')}...`} onClick={handleUpdate} />;
  }
  return (
    <LightTooltip title={data?.error_message || t('SYSTEM_ERROR')} arrow disableTouchListener disableFocusListener>
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
};

const useDatePickerStyles = makeStyles(() => ({
  picker: {
    marginTop: 5,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',

    '& .MuiFormControl-root .MuiInputBase-root': {
      padding: '3px 0px 3px 4px',
      borderRadius: 4,
      '&>input': {
        fontSize: 12,
        padding: 5
      },

      '&.Mui-focused': {
        borderColor: 'transparent'
      },

      '& input': {
        marginTop: 0,
        border: 'none'
      }
    }
  }
}));
