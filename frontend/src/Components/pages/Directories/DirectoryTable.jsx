import { makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ArchiveRounded from '@mui/icons-material/ArchiveRounded';
import UnarchiveRounded from '@mui/icons-material/UnarchiveRounded';
import clsx from 'clsx';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  archiveDirectory,
  removeArchiveDialog,
  setArchiveDialog,
  setDirectoryListParams
} from '../../../actions/directoriesActions';
import { checkPermissions } from '../../../util/verifyRole';
import { ModalWrapper } from '../../Modal/ModalWrapper';
import { DangerButton } from '../../Theme/Buttons/DangerButton';
import { WhiteButton } from '../../Theme/Buttons/WhiteButton';
import NotResultRow from '../../Theme/Table/NotResultRow';
import { StyledTable } from '../../Theme/Table/StyledTable';
import { Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../Theme/Table/StickyTableHead';

const useStyles = makeStyles(() => ({
  default: {
    fontWeight: 900
  }
}));

const DirectoryTable = ({ selectedDirectory, default_for_validation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { archiveDialogData: dialogData, params } = useSelector((s) => s.directories);
  const classes = useStyles();
  const [timeOut, setTimeOut] = useState(null);
  const [search, setSearch] = useState(params || {});

  const IS_REF = selectedDirectory?.reference_type?.code === '106-12' || selectedDirectory?.reference_type?.code === '106-13'

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        dispatch(setDirectoryListParams({ ...params, [key]: value, page: 1 }));
      }, 1000)
    );
  };

  const handleArchive = (data) => {
    if (data?.archived) {
      dispatch(archiveDirectory(data?.uid, { archived: false }));
    } else {
      dispatch(setArchiveDialog(data));
    }
  };

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {selectedDirectory?.reference_type?.title.map((title, index) => (
              <TableCell key={`header-${index}`} className={'MuiTableCell-head'}>
                <p className={title?.params === default_for_validation && classes.default}>
                  {title?.name} {title?.params === default_for_validation && <span className={'danger'}>*</span>}
                </p>
                <input
                  type="text"
                  value={search[title?.params]}
                  onChange={({ target }) => onSearch(title?.params, target.value)}
                />
              </TableCell>
            ))}
            {checkPermissions('DIRECTORIES.DEFAULT.FUNCTIONS.ARCHIVE', 'АКО_Довідники') && !IS_REF && (
              <TableCell style={{ minWidth: 50 }} className={'MuiTableCell-head'} width={50}></TableCell>
            )}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {selectedDirectory?.data?.length === 0 ? (
            <NotResultRow span={selectedDirectory?.reference_type?.title?.length} text={t('NO_DATA_IN_DIRECTORY')} />
          ) : (
            selectedDirectory?.data
              ?.sort((a, b) => a?.archived - b?.archived)
              .map((rowData, rowIndex) => (
                <Row
                  key={`row-${rowIndex}`}
                  disableArchive={IS_REF}
                  data={rowData}
                  titles={selectedDirectory?.reference_type?.title}
                  handleArchive={handleArchive}
                  default_for_validation={default_for_validation}
                />
              ))
          )}
        </TableBody>
      </StyledTable>
      <ModalWrapper header={t('ARCHIVE')} open={Boolean(dialogData)} onClose={() => dispatch(removeArchiveDialog())}>
        <Box sx={{ pt: 3 }}>
          <p>{t('CONFIRM_ARCHIVE_PARAM', { param: dialogData?.code ? ' ' + dialogData?.code : '' })}</p>
        </Box>
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
          <WhiteButton onClick={() => dispatch(removeArchiveDialog())}>{t('CONTROLS.CANCEL')}</WhiteButton>
          <DangerButton onClick={() => dispatch(archiveDirectory(dialogData?.uid, { archived: true }))}>
            <ArchiveRounded />
            {t('CONTROLS.ARCHIVE')}
          </DangerButton>
        </Stack>
      </ModalWrapper>
    </>
  );
};

const Row = ({ data, titles, handleArchive, default_for_validation, disableArchive }) => {
  const classes = useStyles();
  return (
      <TableRow data-marker="table-row" style={{ opacity: data?.archived ? 0.7 : 1 }}>
        {titles?.map(({ params }, titleIndex) => {
          return (
            <TableCell
              data-marker={params}
              className={clsx(params === default_for_validation && classes.default, 'styled')}
              key={`cell-${titleIndex}`}
            >
              {data[params]}
            </TableCell>
          );
        })}
        {checkPermissions('DIRECTORIES.DEFAULT.FUNCTIONS.ARCHIVE', 'АКО_Довідники') && !disableArchive && (
          <TableCell className={'styled'} width={50} data-marker={data?.archived ? 'active' : 'archive'}>
            <IconButton
              onClick={() => handleArchive(data)}
              style={{
                position: 'absolute',
                right: 3,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              {data?.archived ? (
                <UnarchiveRounded style={{ color: '#008C0C' }} />
              ) : (
                <ArchiveRounded style={{ color: '#f90000' }} />
              )}
            </IconButton>
          </TableCell>
        )}
      </TableRow>
  );
};

export default DirectoryTable;
