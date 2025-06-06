import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { ModalWrapper } from '../../Modal/ModalWrapper';
import { getAllOrganizations } from '../../../actions/adminActions';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';
import StyledInput from '../../Theme/Fields/StyledInput';
import SelectField from '../../Theme/Fields/SelectField';
import { Grid } from '@material-ui/core';
import DatePicker from '../../Theme/Fields/DatePicker';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';
import { BlueButton } from '../../Theme/Buttons/BlueButton';
import { GreenButton } from '../../Theme/Buttons/GreenButton';

const RoleDialog = ({ dispatch, open, relations, handleClose, allOrganizations, addRole }) => {
  const {t} = useTranslation();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [startDate, setStartDate] = useState(moment().format('yyyy-MM-DD'));
  const [endDate, setEndDate] = useState(moment().add(1, 'years').format('yyyy-MM-DD'));
  const [openList, setOpenList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [timeOut, setTimeOut] = useState(null);

  const isAddButtonDisabled =
    !selectedRole ||
    !moment(startDate).isValid() ||
    !moment(endDate).isValid() ||
    moment(startDate).unix() > moment(endDate).unix() ||
    moment(startDate).format('yyyy-MM-DD') < moment().format('yyyy-MM-DD');

  useEffect(() => {
    if (allOrganizations) {
      setLoading(false);
    }
  }, [allOrganizations]);

  const handleOnChange = (e) => {
    let value = e.target.value;
    if (e.nativeEvent.inputType === 'insertFromPaste') {
      value = value.trim();
    }
    setValue(value);
    setSelectedOrg(null);
    setRoles([]);
    setSelectedRole(null);
    if (value.length >= 3) {
      setLoading(true);
      setOpenList(true);
      clearTimeout(timeOut);
      setTimeOut(
        setTimeout(() => {
          dispatch(getAllOrganizations(value));
        }, 1000)
      );
    } else {
      setOpenList(false);
    }
  };

  const onSelectOrg = (org) => {
    setSelectedOrg(org);
    setValue(org.name);
    setOpenList(false);
    let usedRelations = relations.filter((i) => i.org.eic === org.eic);
    let availableRoles = org.roles.filter((role) => !usedRelations.find((rel) => rel.role.uid === role.uid));
    setSelectedRole(availableRoles.length > 0 ? availableRoles[0].uid : null);
    setRoles(availableRoles);
  };

  const onChangeRole = (s) => {
    setSelectedRole(s);
  };

  const handleAddRelation = () => {
    setStartDate(moment().format('yyyy-MM-DD'));
    setEndDate(moment().add(1, 'years').format('yyyy-MM-DD'));
    setSelectedOrg(null);
    setSelectedRole(null);
    setRoles([]);
    setValue('');
    addRole({
      date_start: startDate,
      date_end: endDate,
      org: selectedOrg,
      role: selectedOrg.roles.find((i) => i.uid === selectedRole),
      status: moment(startDate).startOf('day').isBefore(new Date()) && moment(endDate).endOf('day').isAfter(new Date())
    });
    handleClose();
  };

  return (
    <ModalWrapper open={open} onClose={handleClose} header={t('CONTROLS.ADD_ROLE')}>
      <div style={{ width: 480, maxWidth: '100%' }}>
        <div className={'drop-down-menu'} style={{ marginTop: 24 }}>
          <StyledInput
            label={t('FIELDS.FIND_ORGANIZATION')}
            value={value}
            onChange={handleOnChange}
          />
          <div className={`drop-down ${openList ? 'open' : ''}`} role="listbox">
            {loading ? (
              <LinearProgress />
            ) : allOrganizations?.length === 0 ? (
              <div className={'empty'}>{t('ORGANIZATION_NOT_FOUND')}</div>
            ) : (
              <div className={'supplier-list'}>
                {allOrganizations?.map((org, index) => (
                  <div
                    className={'supplier-list--item'}
                    key={`supplier-search-${index}`}
                    onClick={() => onSelectOrg(org)}
                  >
                    {org.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {selectedOrg && roles.length === 0 && (
          <span className={'danger'}>{t('FOR_ORGANIZATION_ALL_ROLES_ARE_USED')}</span>
        )}
        {roles.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <SelectField
              onChange={onChangeRole}
              data={roles.map((r) => ({ value: r.uid, label: r.role_ua }))}
              label={t('FIELDS.CHOSE_ROLE')}
              value={selectedRole}
            />
          </div>
        )}
        <Grid container alignItems={'flex-start'} style={{ marginTop: 12, marginBottom: 12 }} spacing={3}>
          <Grid item xs={12} md={6}>
            <DatePicker
              value={startDate}
              label={t('FIELDS.DATE_START')}
              minDate={moment()}
              maxDate={endDate}
              onChange={(d) => setStartDate(d ? moment(d).format('yyyy-MM-DD') : null)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              value={endDate}
              label={t('FIELDS.DATE_END')}
              minDate={startDate}
              minDateMessage={t('VERIFY_MSG.MIN_END_DATE')}
              onChange={(d) => setEndDate(d ? moment(d).format('yyyy-MM-DD') : null)}
            />
          </Grid>
        </Grid>
        <Stack direction={'row'} spacing={3}>
          <BlueButton onClick={handleClose} fullWidth>
            {t('CONTROLS.CANCEL')}
          </BlueButton>
          <GreenButton disabled={isAddButtonDisabled} onClick={handleAddRelation} fullWidth>
            {t('CONTROLS.ADD_ROLE')}
          </GreenButton>
        </Stack>
      </div>
    </ModalWrapper>
  );
};

RoleDialog.propTypes = {
  open: propTypes.bool.isRequired,
  handleClose: propTypes.func.isRequired
};

const mapStateToProps = ({ admin }) => {
  return {
    allOrganizations: admin.allOrganizations
  };
};

export default connect(mapStateToProps)(RoleDialog);
