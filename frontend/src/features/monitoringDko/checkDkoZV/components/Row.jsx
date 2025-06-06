import { TableRow, TableCell, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { LightTooltip } from '../../../../Components/Theme/Components/LightTooltip';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import { mainApi } from '../../../../app/mainApi';
import { useTranslation } from 'react-i18next';
import { defaultParams, setParams } from '../../slice';

const Row = ({ data, columns }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentData: settings } = mainApi.endpoints.settingsMDCHECKDKOZV.useQueryState();

  const getData = (id, value) => {
    switch (id) {
      case 'metering_grid_areas': {
        value = value.join(', ');
        return (
          <LightTooltip
            arrow
            title={
              <Box component="p" sx={styles.eicTooltipe}>
                {value}
              </Box>
            }
          >
            <Box component="p" sx={styles.eicText}>
              {value}
            </Box>
          </LightTooltip>
        );
      }
      case 'checks':
        return value.map((item, index) => <Box key={index}>{t(`CHECK_DKO_ZV.${item}`)}</Box>);
      case 'created_at':
        return value && moment(value).format('DD.MM.yyyy • HH:mm');
      case 'source':
        return value
          ? settings?.fields?.find((i) => i.key === 'source')?.values?.find((i) => i.value === value)?.label
          : value;
      default:
        return value;
    }
  };

  const handleToDetails = (uid) => () => {
    navigate('zv/details/' + uid);
    dispatch(setParams(defaultParams));
  };

  return (
    <>
      <TableRow className="body__table-row" data-marker={'table-row'}>
        {columns.map(({ id, sx }) => (
          <TableCell key={id + data.uid} sx={{ ...styles.cell, ...sx }} data-marker={id}>
            {getData(id, data[id])}
          </TableCell>
        ))}
        <TableCell sx={styles.cell} align={'center'} data-marker={'cell-link'}>
          <CircleButton
            type={'link'}
            size={'small'}
            title={t('PAGES.MONITORING_DKO__DETAILS')}
            onClick={handleToDetails(data.uid)}
          />
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;

const styles = {
  eicTooltipe: {
    maxWidth: 280,
    fontWeight: 400,
    color: '#567691',
    textAlign: 'center',
    p: 1
  },
  eicText: {
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontSize: 12,
    color: 'blue.main'
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
      borderLeft: '1px solid #D1EDF3',
      paddingLeft: '16px'
    },
    '&:last-child': {
      borderRadius: '0 10px 10px 0',
      borderRight: '1px solid #D1EDF3'
    },
    '&:nth-of-type(10n+4)': {
      fontWeight: 500
    }
  }
};
