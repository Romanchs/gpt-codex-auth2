import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import StyledInput from '../../../Theme/Fields/StyledInput';
import DatePicker from '../../../Theme/Fields/DatePicker';
import { useTranslation } from 'react-i18next';

const rolesData = [
  {
    xs: 4,
    title: 'PPKO_ROLES',
    list: [
      { label: 'ROLES.METERING_POINT_ADMINISTRATOR', value: 'meter_point_admin' },
      { label: 'ROLES.METERED_DATA_COLLECTOR', value: 'meter_data_collector' },
      { label: 'ROLES.METERED_DATA_RESPONSIBLE', value: 'meter_data_responsible' },
      { label: 'ROLES.METER_OPERATOR', value: 'meter_operator' }
    ]
  },
  {
    xs: 3,
    title: 'METER_OPERATOR_FUNCTIONS.FUNCTIONS',
    list: [
      {
        label: 'METER_OPERATOR_FUNCTIONS.DESIGN_SHORT',
        value: 'design',
        tooltip: 'METER_OPERATOR_FUNCTIONS.DESIGN'
      },
      {
        label: 'METER_OPERATOR_FUNCTIONS.COMMISSIONING_SHORT',
        value: 'commissioning',
        tooltip: 'METER_OPERATOR_FUNCTIONS.COMMISSIONING'
      },
      {
        label: 'METER_OPERATOR_FUNCTIONS.CALIBRATION_SHORT',
        value: 'calibration',
        tooltip: 'METER_OPERATOR_FUNCTIONS.CALIBRATION'
      },
      {
        label: 'METER_OPERATOR_FUNCTIONS.REPAIR_SHORT',
        value: 'repair',
        tooltip: 'METER_OPERATOR_FUNCTIONS.REPAIR'
      }
    ]
  },
  {
    xs: 2,
    title: '',
    list: [{ label: 'DOMAIN', value: 'domain' }]
  },
  {
    xs: 3,
    title: 'VALIDITY_PERIOD_Of_PPKO_ROLES',
    list: [
      { label: 'FIELDS.STARTED_DATE', value: 'start_date_roles' },
      { label: 'FIELDS.END_DATE', value: 'end_date_roles' }
    ]
  }
];

const PpkoRolesSection = ({ ra_roles, error, setResult, current_registration_status }) => {
  const { t } = useTranslation();
  const [resultDate, setResultDate] = useState({
    startDate: null,
    endDate: null
  });

  const handleChangeAllDate = (value, id) => {
    if (id === 'startDate') {
      setResultDate({ ...resultDate, startDate: value });
      setResult((prev) => ({
        ...prev,
        ra_roles: ra_roles.map((i) => ({ ...i, start_date_roles: value }))
      }));
    } else {
      setResultDate({ ...resultDate, endDate: value });
      setResult((prev) => ({
        ...prev,
        ra_roles: ra_roles.map((i) => ({ ...i, end_date_roles: value }))
      }));
    }
  };

  return (
    <section>
      <h4>{t('ROLES_SECTION')}</h4>
      <div className={'form-section roles'}>
        <div className={'roles-body'}>
          <Grid container spacing={2} justifyContent={'flex-end'} style={{ marginBottom: 8 }}>
            <Grid item>
              <DatePicker
                label={t('FIELDS.GENERAL_START_DATE')}
                value={resultDate.startDate}
                minDate={new Date('01.01.1925')}
                maxDate={new Date('01.01.2200')}
                outFormat={'yyyy-MM-DDTHH:mm:ss+00:00'}
                onChange={(v) => handleChangeAllDate(v, 'startDate')}
              />
            </Grid>
            <Grid item>
              <DatePicker
                label={t('FIELDS.GENERAL_END_DATE')}
                value={resultDate.endDate}
                minDate={new Date('01.01.1925')}
                maxDate={new Date('01.01.2200')}
                outFormat={'yyyy-MM-DDTHH:mm:ss+00:00'}
                onChange={(v) => handleChangeAllDate(v, 'endDate')}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {rolesData.map(({ title, xs }, i) => (
              <Grid key={'roles-' + i} item xs={xs}>
                {title && <h5 className={'text-center'}>{t(title)}</h5>}
              </Grid>
            ))}
          </Grid>
          {ra_roles?.map((role, roleIndex) => (
            <Grid container spacing={2} key={roleIndex}>
              <Grid item xs={rolesData[0].xs}>
                <Grid container spacing={1} wrap={'nowrap'}>
                  {rolesData[0].list?.map(({ label, value }, i) => (
                    <Grid key={'roles-ppko-' + i} item xs={'auto'}>
                      <StyledInput
                        label={t(label)}
                        disabled
                        data-status={'disabled'}
                        value={role[value]?.code?.toString() || ''}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={rolesData[1].xs}>
                {role.meter_operator_funcs?.map((itemRole, keyRole) => (
                  <Grid container spacing={1} key={keyRole}>
                    {rolesData[1].list?.map(({ label, value, tooltip }, i) => (
                      <Grid key={'roles-ozko-' + i} item xs={3}>
                        <LightTooltip title={t(tooltip)} placement="top" arrow>
                          <span>
                            <StyledInput
                              label={t(label)}
                              disabled
                              data-status={'disabled'}
                              value={itemRole[value]?.code.toString() || ''}
                            />
                          </span>
                        </LightTooltip>
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={rolesData[2].xs}>
                <Grid container key={roleIndex}>
                  {rolesData[2].list?.map(({ label, value }, i) => (
                    <Grid key={'roles-empty-' + i} item xs={12}>
                      <StyledInput
                        label={t(label)}
                        disabled
                        data-status={'disabled'}
                        value={(role && role[value]) || ''}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={rolesData[3].xs}>
                <Grid container key={roleIndex} spacing={1}>
                  {rolesData[3].list?.map(({ label, value }, i) => (
                    <Grid key={'roles-data-' + i} item xs={6}>
                      <DatePicker
                        label={t(label)}
                        value={role[value]}
                        error={error?.[roleIndex]?.[value]}
                        minDate={new Date('01.01.1925')}
                        maxDate={new Date('01.01.2200')}
                        outFormat={'yyyy-MM-DDTHH:mm:ss+00:00'}
                        onChange={(v) =>
                          setResult((prev) => ({
                            ...prev,
                            ra_roles: ra_roles?.map((i, index) =>
                              index === roleIndex
                                ? {
                                    ...i,
                                    [value]: v
                                  }
                                : i
                            )
                          }))
                        }
                        required={current_registration_status === 501 || current_registration_status === 506}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </div>
      </div>
    </section>
  );
};

PpkoRolesSection.propTypes = {
  ra_roles: PropTypes.array,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  setResult: PropTypes.func,
  current_registration_status: PropTypes.number
};

PpkoRolesSection.defaultProps = {
  ra_roles: [],
  error: {}
};

export default PpkoRolesSection;
