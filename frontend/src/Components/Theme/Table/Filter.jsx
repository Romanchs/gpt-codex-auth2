import Badge from '@material-ui/core/Badge';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell/TableCell';
import FilterListRounded from '@mui/icons-material/FilterListRounded';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';

import Form from '../../../Forms/Form';
import { clearForm, updateForm } from '../../../Forms/formActions';
import { ModalWrapper } from '../../Modal/ModalWrapper';
import { GreenButton } from '../Buttons/GreenButton';
import { BlueButton } from '../Buttons/BlueButton';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Filter = ({
  dispatch,
  forms,
  name,
  modalHeader,
  children,
  onChange,
  onClear,
  autoApply,
  big,
  unmount,
  clearByChangeRole,
  verifyInputs
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const formState = forms[name];
  const [appliedFilters, setAppliedFilters] = useState(formState || {});
  const [buttonClearFiltersClick, setButtonClearFiltersClick] = useState(false);
  const { relation_id } = useSelector(({ user }) => user.activeRoles[0]);
  const [prevRole, setPrevRole] = useState('');

  useEffect(() => {
    if (!clearByChangeRole) return;
    setPrevRole(relation_id);
    if (prevRole && prevRole !== relation_id) {
      dispatch(clearForm(name));
      setAppliedFilters({});
    }
  }, [dispatch, name, relation_id, prevRole, clearByChangeRole]);

  useEffect(() => {
    if (unmount) {
      dispatch(clearForm(name));
      setAppliedFilters({});
    }
  }, [dispatch, name, unmount]);

  const onFilter = () => {
    onChange(formState || null);
    setAppliedFilters(formState || {});
    if (buttonClearFiltersClick && onClear) onClear(formState);
    setOpen(false);
    setButtonClearFiltersClick(false);
  };

  const handleClearFilter = () => {
    dispatch(clearForm(name));
    setButtonClearFiltersClick(true);
  };

  const handleDisabledSubmitButton = () => {
    if (formState && verifyInputs?.length) {
      for (const item of verifyInputs) {
        if (item?.id in formState && item?.verifyInput && !item.verifyInput(formState[item.id])) {
          return true;
        }
      }
    }
    return false;
  };

  const handleCloseForm = () => {
    if (autoApply) {
      onChange(formState || null);
    } else {
      dispatch(clearForm(name));
      for (const k in appliedFilters) {
        dispatch(updateForm(name, k, appliedFilters[k]));
      }
    }
    setOpen(false);
    setButtonClearFiltersClick(false);
  };

  return (
    <>
      <TableCell style={{ width: 62, paddingBottom: 16 }} className={'MuiTableCell-head'} align={'center'}>
        <Badge
          overlap="rectangular"
          badgeContent={
            autoApply ? (formState ? Object.keys(formState).length : 0) : Object.keys(appliedFilters).length
          }
          data-marker={'filter'}
        >
          <Fab size={'small'} onClick={() => setOpen(true)} className={'filter'}>
            <FilterListRounded />
          </Fab>
        </Badge>
      </TableCell>
      <ModalWrapper
        open={open}
        onClose={handleCloseForm}
        header={modalHeader || t('MODALS.ADDITIONAL_FILTERS')}
        maxWidth={big ? 'lg' : 'sm'}
      >
        <div style={{ marginTop: 20, width: big ? 660 : 480, maxWidth: '100%' }}>
          <Form name={name}>
            <Grid container spacing={3} alignItems={'flex-start'}>
              {children}
            </Grid>
            <Stack direction={'row'} sx={{ pt: 4 }} justifyContent={'space-between'} spacing={3}>
              <BlueButton onClick={handleClearFilter} fullWidth>
                {t('CONTROLS.RESET_FILTER')}
              </BlueButton>
              <GreenButton onClick={onFilter} disabled={handleDisabledSubmitButton()} fullWidth>
                {t('CONTROLS.APPLY')}
              </GreenButton>
            </Stack>
          </Form>
        </div>
      </ModalWrapper>
    </>
  );
};

Filter.propTypes = {
  name: propTypes.string.isRequired,
  modalHeader: propTypes.string,
  onChange: propTypes.func.isRequired,
  onClear: propTypes.func,
  autoApply: propTypes.bool,
  clearByChangeRole: propTypes.bool,
  verifyInputs: propTypes.array
};

Filter.defaultProps = {
  onClear: null,
  autoApply: true,
  big: false,
  unmount: false,
  clearByChangeRole: false,
  verifyInputs: []
};

const mapStateToProps = ({ forms }) => ({
  forms: forms
});

export default connect(mapStateToProps)(Filter);
