import Page from '../../../Global/Page';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import { Box, Stack, TableCell } from '@mui/material';
import { Pagination } from '../../../Theme/Table/Pagination';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import AddSpecialMeteringGridAreaModal from './AddSpecialMeteringGridAreaModal';
import {
  useArchiveSpecialMeteringGridAreaMutation,
  useLazyDownloadSpecialMeteringGridAreaQuery,
  useSpecialMeteringGridAreaQuery
} from './api';
import { verifyRole } from '../../../../util/verifyRole';
import Row from './Row';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { useSearchParams } from 'react-router-dom';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { archiveDirectory, removeArchiveDialog } from '../../../../actions/directoriesActions';
import { WhiteButton } from '../../../Theme/Buttons/WhiteButton';
import { DangerButton } from '../../../Theme/Buttons/DangerButton';
import ArchiveRounded from '@mui/icons-material/ArchiveRounded';

const columns = [
  { key: 'so_code', label: 'FIELDS.CODE' },
  { key: 'so_type', label: 'FIELDS.TYPE' },
  { key: 'y_eic', label: 'FIELDS.METERING_GRID_AREA_ID' },
  { key: 'short_name', label: 'FIELDS.SHORT_NAME' },
  { key: 'full_name', label: 'FIELDS.NAME' },
  { key: 'x_eic', label: 'FIELDS.BELONGS_EIC_X' },
  { key: 'usreou', label: 'FIELDS.USREOU' },
  { key: 'functional_role', label: 'FIELDS.FUNCTIONAL_ROLE' }
];

const SpecialMeteringGridArea = () => {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');
  const { t } = useTranslation();
  const timeout = useRef(null);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [archiveDialogData, setArchiveDialogData] = useState(null);
  const [search, setSearch] = useState(columns.map((i) => ({ [i.key]: '' })));
  const { data, isFetching } = useSpecialMeteringGridAreaQuery(params);
  const [archive] = useArchiveSpecialMeteringGridAreaMutation();
  const [download] = useLazyDownloadSpecialMeteringGridAreaQuery();
  const [openAdd, setOpenAdd] = useState(false);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams((p) => {
        const updatedParams = { ...p, page: 1, size: 25 };
        if (value === null || value === undefined) {
          delete updatedParams[key];
        } else {
          updatedParams[key] = value;
        }
        return updatedParams;
      });
    }, 500);
  };

  const handleArchive = () => {
    if (archiveDialogData?.uid) {
      archive({ uid: archiveDialogData?.uid, archived: true }).unwrap().then(() => {
        setArchiveDialogData(null);
      }).catch(() => {});
    }
  };

  const handleArchiveModal = (data) => {
    setArchiveDialogData({ uid: data.uid, code: data.so_code });
  };

  const handleDownload = () => {
    download({ name: `DATAHUB-${uid}-Спеціальні_області_обліку`, uid: uid });
  };

  return (
    <Page
      pageName={`202-11 ${t('PAGES.SPECIAL_ACCOUNTING_AREAS')}`}
      backRoute={'/directories'}
      loading={isFetching}
      acceptPermisions={'DIRECTORIES.SPECIAL_ACCOUNTING_AREAS.ACCESS'}
      acceptRoles={['АКО_Процеси', 'АКО_Довідники']}
      controls={
        <>
          {uid && <CircleButton onClick={handleDownload} type={'download'} title={t('CONTROLS.DOWNLOAD_DIRECTORY')} />}
          {verifyRole('АКО_Довідники') && (
            <CircleButton type={'add'} title={t('CONTROLS.ADD')} onClick={() => setOpenAdd(true)} />
          )}
        </>
      }
    >
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ key, label, width = 'auto' }) => (
              <TableCell key={key} sx={{ width }} className={'MuiTableCell-head'}>
                <p>{t(label)}</p>
                <input
                  type={'text'}
                  value={search[key] || ''}
                  onChange={({ target }) => onSearch(key, target.value || undefined)}
                />
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
          <TableRow style={{ height: 8 }} />
        </StickyTableHead>
        <TableBody>
          {data?.data?.length > 0 ? (
            data.data.map((rowData) => (
              <Row
                key={`row-${rowData?.uid || rowData?.id}}`}
                data={rowData}
                columns={[
                  'so_code',
                  'so_type',
                  'y_eic',
                  'short_name',
                  'full_name',
                  'x_eic',
                  'usreou',
                  'functional_role'
                ]}
                handleArchive={handleArchiveModal}
              />
            ))
          ) : (
            <NotResultRow span={columns.length} text={t('NO_DATA')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...data} params={params} loading={isFetching} onPaginate={(p) => setParams({ ...params, ...p })} />
      <AddSpecialMeteringGridAreaModal open={openAdd} onClose={() => setOpenAdd(false)} />
      <ModalWrapper header={t('ARCHIVE')} open={Boolean(archiveDialogData)} onClose={() => setArchiveDialogData(null)}>
        <Box sx={{ pt: 3 }}>
          <p>{t('CONFIRM_ARCHIVE_PARAM', { param: archiveDialogData?.code ? ' ' + archiveDialogData?.code : '' })}</p>
        </Box>
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
          <WhiteButton onClick={() => setArchiveDialogData(null)}>{t('CONTROLS.CANCEL')}</WhiteButton>
          <DangerButton onClick={handleArchive}>
            <ArchiveRounded />
            {t('CONTROLS.ARCHIVE')}
          </DangerButton>
        </Stack>
      </ModalWrapper>
    </Page>
  );
};

export default SpecialMeteringGridArea;
