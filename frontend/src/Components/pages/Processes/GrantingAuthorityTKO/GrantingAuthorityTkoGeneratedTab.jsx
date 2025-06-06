import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import WarningRounded from '@mui/icons-material/WarningRounded';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { downloadFileById } from '../../../../actions/massLoadActions';
import { getGeneratedFilesGrantingAuthority } from '../../../../actions/processesActions';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { key: 'created_at', title: 'FIELDS.GENERATE_FILE_DATE', search: false, minWidth: 250 },
  { key: 'file_name', title: 'FIELDS.FILENAME', search: false, minWidth: 200 },
  { key: 'all_tko_count', title: 'FIELDS.AP_COUNT_IN_FILE', search: false, minWidth: 200 }
];

const GrantingAuthorityTkoGeneratedTab = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { currentProcess, loading } = useSelector(({ processes }) => processes);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const exportFileLog = useExportFileLog(['Запит на перегляд даних ТКО']);

  // Check roles & get data
  useEffect(() => {
    dispatch(getGeneratedFilesGrantingAuthority(uid, params));
  }, [dispatch, uid, relation_id, params]);

  const handleDownload = (file) => {
    dispatch(downloadFileById(file?.file_processed_id, file?.file_name));
    exportFileLog(uid);
  };

  const handleUpdateList = () => {
    dispatch(getGeneratedFilesGrantingAuthority(uid, params));
  };

  return (
    <>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                style={{ minWidth: column.minWidth, width: column.width }}
                className={'MuiTableCell-head'}
                key={'header' + index}
              >
                <p>{t(column.title)}</p>
              </TableCell>
            ))}
            <TableCell className={'MuiTableCell-head'}></TableCell>
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {currentProcess?.resulted_files?.data?.length === 0 ? (
            <NotResultRow text={`${t('FILES_ARE_MISSING')}!`} span={7} small />
          ) : (
            currentProcess?.resulted_files?.data?.map((file, index) => (
              <>
                <TableRow data-marker="table-row" className="body__table-row" key={`row-${index}`}>
                  <TableCell data-marker={'created_at'}>
                    {file?.created_at ? moment(file?.created_at).format('DD.MM.yyyy • HH:mm') : ''}
                  </TableCell>
                  <TableCell data-marker={'file_name'}>{file?.file_name || ''}</TableCell>
                  <TableCell data-marker={'all_tko_count'}>{file?.all_tko_count?.toString() || ''}</TableCell>
                  <TableCell data-marker={'download'}>
                    {(file?.status === 'FAILED' || file?.status === 'BAD_FILE_STRUCTURE') && (
                      <LightTooltip
                        title={
                          file?.status === 'BAD_FILE_STRUCTURE'
                            ? t('FILE_PROCESSING_STATUSES.BAD_FILE_STRUCTURE')
                            : t('FILE_PROCESSING_STATUSES.FAILED')
                        }
                        arrow
                        disableTouchListener
                        disableFocusListener
                      >
                        <WarningRounded
                          style={{
                            color: '#f90000',
                            fontSize: 22,
                            cursor: 'pointer'
                          }}
                        />
                      </LightTooltip>
                    )}
                    {file?.file_name && file?.status !== 'FAILED' && file?.status !== 'BAD_FILE_STRUCTURE' && (
                      <CircleButton
                        type={file?.status === 'IN_PROCESS' || file?.status === 'NEW' ? 'loading' : 'download'}
                        size={'small'}
                        onClick={() =>
                          file?.status === 'DONE' || file?.status === 'FAILED'
                            ? handleDownload(file)
                            : handleUpdateList()
                        }
                        title={
                          file?.status === 'DONE' || file?.status === 'FAILED'
                            ? t('CONTROLS.DOWNLOAD_FILE')
                            : `${t('FILE_PROCESSING')}...`
                        }
                      />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow style={{ height: 8 }}></TableRow>
              </>
            ))
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        loading={loading}
        params={params}
        onPaginate={(v) => {
          setParams({ ...params, ...v });
        }}
        {...currentProcess?.resulted_files}
      />
    </>
  );
};

export default GrantingAuthorityTkoGeneratedTab;
