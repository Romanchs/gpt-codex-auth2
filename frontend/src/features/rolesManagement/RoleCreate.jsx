import Grid from '@material-ui/core/Grid';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import CheckBoxRounded from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRounded from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import React, { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { Controller, useForm } from 'react-hook-form';

import Page from '../../Components/Global/Page';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { GreenButton } from '../../Components/Theme/Buttons/GreenButton';
import { Card } from '../../Components/Theme/Components/Card';
import StyledInput from '../../Components/Theme/Fields/StyledInput';
import StyledInputWhite from '../../Components/Theme/Fields/StyledInputWhite';
import { useStyles } from './styles';
import { useNavigate } from 'react-router-dom';
import { noop } from 'lodash';
import SelectField from '../../Components/Theme/Fields/SelectField';
import { filterNodes, getChangesData, getUiPermissions, getUpdateData, transformDataToThree } from './utils';
import { RoleChanges } from './components/RoleChanges';
import { useCreateRoleMutation, useLazyGetRoleQuery, useRolesListQuery } from './api';
import { useTranslation } from 'react-i18next';

export const RoleCreate = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();

  const { data: rolesList, isFetching: loading } = useRolesListQuery();
  const [getRole, { data: parentRole, isFetching: loadingRole }] = useLazyGetRoleQuery();

  const [valueSearch, setValueSearch] = useState('');

  const [expanded, setExpanded] = useState([]);
  const [checked, setChecked] = useState([]);

  const [changes, setChanges] = useState(null);
  const [threeNodes, setThreeNodes] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState(null);

  const {
    control,
    getValues,
    watch,
    trigger,
    formState: { isValid }
  } = useForm();

  const existingRolesValue = watch('existing_roles');

  useEffect(() => {
    if (existingRolesValue) {
      getRole(existingRolesValue);
    }
  }, [existingRolesValue, getRole]);

  useEffect(() => {
    if (parentRole?.permissions) {
      setThreeNodes(transformDataToThree(parentRole.permissions));
      setChecked(getUiPermissions(parentRole.permissions));
    }
  }, [parentRole]);

  const onChanges = () => {
    const updateData = getUpdateData(parentRole.permissions, checked);

    const changeData = getChangesData(parentRole.permissions, updateData);

    setChanges(changeData);
    trigger();
  };

  const onCreate = () => {
    const data = {
      ...getValues(),
      existing_roles: undefined,
      permissions: getUpdateData(parentRole.permissions, checked)
    };

    createRole(data).then(() => navigate('/admin/roles-manage'));
  };

  const onSearchFunctions = () => {
    if (!valueSearch) {
      setFilteredNodes(threeNodes);
      return;
    }
    setFilteredNodes(filterNodes(threeNodes, valueSearch));
  };

  return (
    <Page
      pageName={t('PAGES.CREATE_ROLE')}
      backRoute={() => navigate(-1)}
      loading={loading || loadingRole || isCreating}
      controls={
        <>
          {!changes && (
            <CircleButton type={'create'} title={t('CONTROLS.NEXT')} onClick={onChanges} disabled={!isValid} />
          )}

          {changes && (
            <>
              <CircleButton
                type={'remove'}
                title={t('CONTROLS.CANCEL')}
                onClick={() => {
                  setChanges(null);
                  trigger();
                }}
              />
              <CircleButton type={'new'} title={t('CONTROLS.SAVE')} onClick={onCreate} disabled={!isValid} />
            </>
          )}
        </>
      }
    >
      <Card title={t('ROLE_DETAILS')}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Controller
              name="existing_roles"
              control={control}
              render={({ field }) => (
                <SelectField
                  label={t('FIELDS.SELECT_TEMPLATE')}
                  data={
                    rolesList
                      ?.filter((role) => role?.name_ua && role?.is_active)
                      ?.map((ralation) => ({
                        value: ralation?.uid,
                        label: ralation?.name_ua
                      })) || []
                  }
                  dataMarker={'select_template'}
                  onChange={noop}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="name_ua"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <StyledInput label={t('FIELDS.ROLE_NAME')} dataMarker={'role_name'} required {...field} />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="code"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <StyledInput
                  label={t('FIELDS.ROLE_NAME_IN_SYSTEM')}
                  dataMarker={'role_name_in_system'}
                  required
                  {...field}
                />
              )}
            />
          </Grid>

          {changes && (
            <Grid item xs={12}>
              <Controller
                name="note"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <StyledInput label={t('FIELDS.COMMENT')} required {...field} />}
              />
            </Grid>
          )}
        </Grid>
      </Card>

      {!changes && existingRolesValue && parentRole?.permissions && (
        <Card
          title={
            <Grid container spacing={3} alignItems={'center'}>
              <Grid item xs={11}>
                <StyledInputWhite
                  label={t('SEARCH')}
                  value={valueSearch || ''}
                  dataMarker={'search'}
                  onChange={({ target }) => setValueSearch(target.value)}
                />
              </Grid>
              <Grid item xs={1}>
                <GreenButton style={{ height: 40 }} data-marker={'find'} onClick={onSearchFunctions}>
                  {t('FIND')}
                </GreenButton>
              </Grid>
            </Grid>
          }
          noPadding
        >
          <div className={classes.tree}>
            <CheckboxTree
              expandOnClick
              onClick={noop}
              checkModel={'all'}
              className={'my-tree'}
              nodes={filteredNodes || threeNodes}
              checked={checked}
              expanded={expanded}
              onCheck={(checked) => setChecked(checked)}
              onExpand={(expanded) => setExpanded(expanded)}
              icons={{
                check: <CheckBoxRounded data-status={'Checked'} data-marker={'checked'} />,
                uncheck: <CheckBoxOutlineBlankRounded data-status={'Unchecked'} data-marker={'unchecked'} />,
                halfCheck: (
                  <span className={classes.halfCheck}>
                    <CheckBoxRounded data-status={'Indeterminate'} data-marker={'indeterminate'} />
                  </span>
                ),
                expandClose: <ChevronRightRounded />,
                expandOpen: <ExpandMoreRounded />,
                expandAll: null,
                collapseAll: null,
                parentClose: null,
                parentOpen: null,
                leaf: null
              }}
            />
          </div>
        </Card>
      )}

      {changes && <RoleChanges data={changes} />}
    </Page>
  );
};
