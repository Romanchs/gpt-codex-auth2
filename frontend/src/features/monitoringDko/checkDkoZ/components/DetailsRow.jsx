import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import WarningRounded from '@mui/icons-material/WarningRounded';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { LightTooltip } from '../../../../Components/Theme/Components/LightTooltip';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import { mainApi } from '../../../../app/mainApi';
import { useLazyDownloadFileMDCHECKDKOZQuery, useDetailsMDCHECKDKOZQuery } from '../api';
import { checkPermissions } from '../../../../util/verifyRole';

const DetailsRow = ({ data, columns, isSelect, handleSelect }) => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const params = useSelector((store) => store.monitoringDko.params);

  const { currentData: settings } = mainApi.endpoints.settingsMDCHECKDKOZ.useQueryState();
  const { refetch } = useDetailsMDCHECKDKOZQuery({ uid, params });
  const [downloadFile] = useLazyDownloadFileMDCHECKDKOZQuery();

  const downloadButton = (row) => {
    if (row?.status === 'NEW' || row?.status === 'IN_PROCESS') {
      return <CircleButton type={'loading'} size={'small'} onClick={refetch} title={`${t('FILE_PROCESSING')}...`} />;
    }
    return (
      <LightTooltip title={row?.description} arrow disableFocusListener>
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

  const getData = (id, value) => {
    if (id === 'created_at' || id === 'finished_at') return value && moment(value).format('DD.MM.yyyy • HH:mm');
    if (id === 'is_sent') return (value ? t('CONTROLS.YES') : t('CONTROLS.NO')).toUpperCase();
    if (id === 'ap_group') {
      return value
        ? settings?.fields?.find((i) => i.key === 'group')?.values?.find((i) => i.value === value)?.label
        : value;
    }
    return value;
  };

  return (
    <TableRow sx={styles.row} data-marker={'table-row'}>
      {checkPermissions('MONITORING_DKO.DETAILS.TABLE_CELLS.SELECT', ['АКО_Процеси']) && (
        <TableCell sx={{ ...styles.cell, width: 60, minWidth: '60px', textAlign: 'center' }}>
          <IconButton
            aria-label={'select row'}
            size={'small'}
            onClick={() => handleSelect(data.uid)}
            sx={{ ...styles.icon, ...(isSelect && styles.iconSelected) }}
            data-marker={isSelect ? 'selected' : 'not-selected'}
          >
            {isSelect ? <CheckCircleOutlineRounded /> : <RadioButtonUncheckedRounded />}
          </IconButton>
        </TableCell>
      )}
      {columns.map(({ id, sx }) => {
        if(id === 'is_sent' && !checkPermissions('MONITORING_DKO.DETAILS.TABLE_CELLS.SEND', ['АКО_Процеси']))
          return;
        return (
          <TableCell key={id + data.uid} sx={{ ...styles.cell, ...sx, ...colorText(id, data[id]) }} data-marker={id}>
            {getData(id, data[id])}
          </TableCell>
        );
      })}
      <TableCell sx={styles.cell} align={'center'} data-marker={'download'}>
        {data?.status === 'DONE' ? (
          <CircleButton
            size={'small'}
            type={'download'}
            title={t('CONTROLS.DOWNLOAD')}
            onClick={() => downloadFile({ process_uid: uid, file_uid: data?.uid })}
          />
        ) : (
          downloadButton(data)
        )}
      </TableCell>
    </TableRow>
  );
};

export default DetailsRow;

const colorText = (id, value) => {
  if (id === 'is_sent') {
    return value ? { color: '#008C0C' } : { color: '#FF0000' };
  }
  return {};
};

const styles = {
  row: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10
  },
  cell: {
    p: '12px',
    borderBottom: '1px solid #D1EDF3',
    borderTop: '1px solid #D1EDF3',
    bgcolor: 'blue.contrastText',
    fontSize: 12,
    color: '#567691',
    '&:first-of-type': {
      borderRadius: '10px 0 0 10px',
      borderLeft: '1px solid #D1EDF3'
    },
    '&:last-child': {
      borderRadius: '0 10px 10px 0',
      borderRight: '1px solid #D1EDF3'
    },
    '&:nth-of-type(10n+4)': {
      fontWeight: 500
    }
  },
  icon: {
    '& svg': {
      fontSize: 24,
      color: 'blue.main'
    }
  },
  iconSelected: {
    '& svg': {
      fontSize: 24,
      color: '#F28C60'
    }
  }
};
