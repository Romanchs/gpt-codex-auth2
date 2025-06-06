import { makeStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import moment from 'moment';

import { WhiteButton } from '../../Theme/Buttons/WhiteButton';
import { LightTooltip } from '../../Theme/Components/LightTooltip';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const usePpkoRowStyles = makeStyles({
  head: {
    '& > *': {
      color: '#567691',
      fontSize: 11,
      borderBottom: '1px solid #4A5B7A !important',
      padding: '10px !important',
      '&:first-child': {
        paddingLeft: 0
      },
      '&:last-child': {
        paddingRight: 0
      }
    }
  },
  body: {
    '& > *': {
      color: '#567691',
      fontSize: 10,
      fontWeight: 400,
      padding: 10
    }
  },
  controls: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 16,
    '& > *': {
      marginLeft: 16,
      padding: '3px 12px',
      '& > *': {
        fontSize: 11
      },
      '& svg': {
        fontSize: 12
      }
    }
  }
});

const RolesContent = ({ id, ra_roles }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = usePpkoRowStyles();
  return (
    <>
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow className={classes.head}>
            <TableCell style={{ minWidth: 50 }} align={'center'}>
              {t('ROLES.METER_OPERATOR')}
            </TableCell>
            <TableCell style={{ minWidth: 50 }} align={'center'}>
              {t('ROLES.METERING_POINT_ADMINISTRATOR')}
            </TableCell>
            <TableCell style={{ minWidth: 50 }} align={'center'}>
              {t('ROLES.METERED_DATA_COLLECTOR')}
            </TableCell>
            <TableCell style={{ minWidth: 50 }} align={'center'}>
              {t('ROLES.METERED_DATA_RESPONSIBLE')}
            </TableCell>
            <TableCell style={{ minWidth: 50 }} align={'center'}>
              {t('ROLES.METERED_DATA_AGGREGATOR')}
            </TableCell>
            <TableCell style={{ minWidth: 50 }} align={'center'}>
              <LightTooltip title={t('ROLES.DESIGN')} placement="top" arrow>
                <span>{t('ROLES.DESIGN_SHORT')}</span>
              </LightTooltip>
            </TableCell>
            <TableCell style={{ minWidth: 50 }} align={'center'}>
              <LightTooltip title={t('ROLES.COMMISSIONING')} placement="top" arrow>
                <span>{t('ROLES.COMMISSIONING_SHORT')}</span>
              </LightTooltip>
            </TableCell>
            <TableCell style={{ minWidth: 50 }} align={'center'}>
              <LightTooltip title={t('ROLES.CALIBRATION')} placement="top" arrow>
                <span>{t('ROLES.CALIBRATION_SHORT')}</span>
              </LightTooltip>
            </TableCell>
            <TableCell style={{ minWidth: 50 }} align={'center'}>
              <LightTooltip title={t('ROLES.REPAIR')} placement="top" arrow>
                <span>{t('ROLES.REPAIR_SHORT')}</span>
              </LightTooltip>
            </TableCell>
            <TableCell style={{ minWidth: 120 }}>{t('DOMAIN')}</TableCell>
            <TableCell style={{ width: 120 }}>{t('START_DATE_PPKO_ROLES')}</TableCell>
            <TableCell style={{ width: 120 }}>{t('END_DATE_PPKO_ROLES')}</TableCell>
            <TableCell style={{ minWidth: 120 }}>{t('FIELDS.METERING_GRID_AREA')}</TableCell>
            <TableCell style={{ width: 260 }}>{t('FIELDS.AREA_NAME')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ra_roles.map((roles, index) => {
            return (
              <TableRow key={'cell' + index} className={classes.body}>
                <TableCell data-marker={'meter_operator'} align={'center'}>
                  {roles.meter_operator}
                </TableCell>
                <TableCell data-marker={'meter_point_admin'} align={'center'}>
                  {roles.meter_point_admin}
                </TableCell>
                <TableCell data-marker={'meter_data_collector'} align={'center'}>
                  {roles.meter_data_collector}
                </TableCell>
                <TableCell data-marker={'meter_data_responsible'} align={'center'}>
                  {roles.meter_data_responsible}
                </TableCell>
                <TableCell data-marker={'meter_data_aggregator'} align={'center'}>
                  {roles.meter_data_aggregator}
                </TableCell>
                <TableCell data-marker={'meter_operator_design_code'} align={'center'}>
                  {roles.meter_operator_design_code ? roles.meter_operator_design_code : 0}
                </TableCell>
                <TableCell data-marker={'meter_operator_commissioning_code'} align={'center'}>
                  {roles.meter_operator_commissioning_code ? roles.meter_operator_commissioning_code : 0}
                </TableCell>
                <TableCell data-marker={'meter_operator_calibration_code'} align={'center'}>
                  {roles.meter_operator_calibration_code ? roles.meter_operator_calibration_code : 0}
                </TableCell>
                <TableCell data-marker={'meter_operator_repair_code'} align={'center'}>
                  {roles.meter_operator_repair_code ? roles.meter_operator_repair_code : 0}
                </TableCell>
                <TableCell data-marker={'eic_w'}>{roles.domain.eic_w}</TableCell>
                <TableCell data-marker={'start_date_roles'}>
                  {roles.start_date_roles && moment(roles.start_date_roles).format('DD.MM.yyyy')}
                </TableCell>
                <TableCell data-marker={'end_date_roles'}>
                  {roles.end_date_roles && moment(roles.end_date_roles).format('DD.MM.yyyy')}
                </TableCell>
                <TableCell data-marker={'metering_grid_area_identification'}>
                  {roles.domain.metering_grid_area_identification}
                </TableCell>
                <TableCell data-marker={'metering_grid_area_name'}>{roles.domain.metering_grid_area_name}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className={classes.controls}>
        <WhiteButton onClick={() => navigate(`ppko/${id}`)}>
          <VisibilityRounded />
          {t('CONTROLS.SHOW_PPKO_CONTACTS')}
        </WhiteButton>
      </div>
    </>
  );
};

export default RolesContent;
