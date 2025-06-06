import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import React from 'react';

import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import WarningRounded from '@mui/icons-material/WarningRounded';
import DoneRounded from '@mui/icons-material/DoneRounded';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import { disputesActions } from '../disputes.slice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  {
    id: 'company',
    title: 'FIELDS.INITIATOR_COMPANY_NAME',
    minWidth: 410,
    cols: 2
  },
  {
    id: 'created_at',
    title: 'FIELDS.DOWNLOAD_DATETIME',
    minWidth: 130,
    cols: 4
  },
  {
    id: 'file_name',
    title: 'FIELDS.FILENAME',
    minWidth: 200,
    cols: 4
  },
  {
    id: 'result',
    title: 'FIELDS.FILE_RETURN_CODES',
    minWidth: 100,
    cols: 4
  }
];

export const DisputesEntityDkoFiles = ({ data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleDelete = (link) => {
    dispatch(disputesActions.deleteFile(link));
  };

  const handleDownload = (file) => async () => {
    dispatch(disputesActions.downloadFile({ link: file?.link_download, fileName: file?.file_name }));
  };

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          {columns.map(({ id, title, minWidth, cols }) => (
            <TableCell key={id} style={{ minWidth }} colSpan={cols} className={'MuiTableCell-head'}>
              {t(title)}
            </TableCell>
          ))}

          <TableCell style={{ minWidth: 40 }} colSpan={1} className={'MuiTableCell-head'}></TableCell>
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {!data?.length && <NotResultRow span={12} text={t('NO_IMPORTED_FILES')} small />}
        {data?.map((file, index) => (
          <TableRow data-marker="table-row" className="body__table-row" key={`row-${index}`}>
            <TableCell data-marker={'company'} colSpan={2}>
              {file?.company || '-'}
            </TableCell>
            <TableCell data-marker={'created_at'} colSpan={4}>
              {moment(file?.created_at).format('DD.MM.YYYY  •  HH:mm')}
            </TableCell>
            <TableCell data-marker={'file_name'} colSpan={4}>
              {file?.file_name || '-'}
            </TableCell>
            <TableCell data-marker={'result'} colSpan={4}>
              <div style={{ textAlign: 'center' }}>
                {(file?.status === 'FAILED' || file?.status === 'SYSTEM_ERROR' || file?.status === 'WARNING') && (
                  <>
                    {file?.status_description && (
                      <LightTooltip title={file?.status_description} arrow disableFocusListener data-marker={'tooltip'}>
                        <WarningRounded
                          style={{
                            color: file?.status === 'WARNING' ? '#f28c60' : '#FF0000',
                            fontSize: 26,
                            marginTop: -4,
                            marginBottom: -6
                          }}
                        />
                      </LightTooltip>
                    )}

                    {!file?.status_description && (
                      <WarningRounded
                        style={{
                          color: file?.status === 'WARNING' ? '#f28c60' : '#FF0000',
                          fontSize: 26,
                          marginTop: -4,
                          marginBottom: -6
                        }}
                      />
                    )}
                  </>
                )}
                {file?.status === 'PROCESSED' && (
                  <DoneRounded
                    style={{
                      color: '#018C0D',
                      fontSize: 26,
                      marginTop: -4,
                      marginBottom: -6
                    }}
                  />
                )}
                {file?.status === 'IN_PROCESS' && (
                  <CircleButton type={'loading'} title={t('IN_PROGRESS')} size={'small'} />
                )}
              </div>
            </TableCell>
            <TableCell data-marker={'actions'} colSpan={2}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                {file?.link_delete && (
                  <CircleButton
                    size={'small'}
                    title={t('CONTROLS.DELETE_FILE')}
                    type={'delete'}
                    dataMarker={'dko-dispute-char-cancel'}
                    onClick={() => handleDelete(file?.link_delete)}
                  />
                )}

                {file?.link_download && (
                  <CircleButton
                    size="small"
                    title={t('CONTROLS.DOWNLOAD_DISPUTES_ENTITY_DKO')}
                    color={'blue'}
                    type={'download'}
                    onClick={handleDownload(file)}
                  />
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </StyledTable>
  );
};
