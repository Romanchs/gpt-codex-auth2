import Grid from '@material-ui/core/Grid';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import CheckBoxRounded from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRounded from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import React, { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import Page from '../../Components/Global/Page';
import { GreenButton } from '../../Components/Theme/Buttons/GreenButton';
import { Card } from '../../Components/Theme/Components/Card';
import StyledInput from '../../Components/Theme/Fields/StyledInput';
import StyledInputWhite from '../../Components/Theme/Fields/StyledInputWhite';
import { useStyles } from './styles';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { RoleChanges } from './components/RoleChanges';
import { filterNodes, getChangesData, getUiPermissions, getUpdateData, transformDataToThree } from './utils';
import { useLazyExportRoleQuery, useLazyGetRoleQuery, useUpdateRoleMutation } from './api';
import { noop } from 'lodash';
import CancelModal from '../../Components/Modal/CancelModal';
import { useTranslation } from 'react-i18next';

export const RoleEdit = () => {
  const {t} = useTranslation();
  const { uid } = useParams();

  const classes = useStyles();
  const navigate = useNavigate();

  const [getRole, { data: role, isFetching: loading }] = useLazyGetRoleQuery();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [exportRole, { isLoading: isExporting }] = useLazyExportRoleQuery();

  const [valueSearch, setValueSearch] = useState('');

  const [expanded, setExpanded] = useState([]);
  const [checked, setChecked] = useState([]);
  const [changes, setChanges] = useState(null);
  const [threeNodes, setThreeNodes] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState(null);
  const [openArchiveModal, setOpenArchiveModal] = useState(false);

  const {
    control,
    reset,
    getValues,
    trigger,
    formState: { isValid }
  } = useForm();

  useEffect(() => {
    if (role?.permissions) {
      setThreeNodes(transformDataToThree(role.permissions, !role.is_active));
      setChecked(getUiPermissions(role.permissions));
    }
  }, [role, setThreeNodes, setChecked]);

  useEffect(() => {
    getRole(uid)
      .unwrap()
      .catch(() => navigate('/admin/roles-manage'));
  }, [uid, getRole, navigate]);

  useEffect(() => {
    reset({ ...role });
  }, [role, reset]);

  const onChanges = () => {
    const updateData = getUpdateData(role.permissions, checked);
    const changeData = getChangesData(role.permissions, updateData);

    setChanges(changeData);
    trigger();
  };

  const onUpdate = () => {
    const data = {
      ...getValues(),
      existing_roles: undefined,
      permissions: getUpdateData(role.permissions, checked)
    };

    updateRole({ uid, ...data }).then(() => navigate('/admin/roles-manage'));
  };

  const onSearchFunctions = () => {
    if (!valueSearch) {
      setFilteredNodes(threeNodes);
      return;
    }
    setFilteredNodes(filterNodes(threeNodes, valueSearch));
  };

  const handleUnArchive = () => {
    const params = { ...role, is_active: true };

    updateRole({ uid, ...params }).then(() => setOpenArchiveModal(false));
  };

  return (
    <Page
      pageName={t('ROLE_EDIT')}
      backRoute={'/admin/roles-manage'}
      loading={loading || isUpdating}
      controls={
        <>
          <CircleButton
            type={'download'}
            title={t('CONTROLS.EXPORT_ROLE')}
            onClick={() => exportRole({ uid, role })}
            disabled={isExporting}
          />
          {!role?.is_active && (
            <CircleButton
              type={'unarchive'}
              title={t('CONTROLS.UNARCHIVE')}
              onClick={() => setOpenArchiveModal(true)}
              disabled={!isValid}
            />
          )}
          {!changes && role?.is_active && (
            <CircleButton type={'create'} title={t('CONTROLS.NEXT')} onClick={onChanges} disabled={!isValid} />
          )}

          {changes && role?.is_active && (
            <>
              <CircleButton
                type={'remove'}
                title={t('CONTROLS.CANCEL')}
                onClick={() => {
                  setChanges(null);
                  trigger();
                }}
              />
              <CircleButton type={'new'} title={t('CONTROLS.SAVE')} onClick={onUpdate} disabled={!isValid} />
            </>
          )}
        </>
      }
    >
      <Card title={t('ROLE_DETAILS')}>
        <Grid container spacing={3}>
          {role?.existing_roles && (
            <Grid item xs={4}>
              <Controller
                name="existing_roles"
                control={control}
                render={({ field }) => <StyledInput label={t('FIELDS.TEMPLATE')} readOnly {...field} />}
              />
            </Grid>
          )}

          <Grid item xs={4}>
            <Controller
              name="name_ua"
              control={control}
              render={({ field }) => <StyledInput label={t('FIELDS.ROLE_NAME')} {...field} />}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => <StyledInput label={t('FIELDS.ROLE_NAME_IN_SYSTEM')} {...field} />}
            />
          </Grid>
        </Grid>
      </Card>

      {!changes && role?.permissions && (
        <Card
          title={
            <Grid container spacing={3} alignItems={'center'}>
              <Grid item xs={11}>
                <StyledInputWhite
                  label={t('SEARCH')}
                  value={valueSearch || ''}
                  onChange={({ target }) => {
                    setValueSearch(target.value);
                  }}
                />
              </Grid>
              <Grid item xs={1}>
                <GreenButton style={{ height: 40 }} onClick={onSearchFunctions}>
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
              className={'my-tree'}
              nodes={filteredNodes || threeNodes}
              checked={checked}
              expanded={expanded}
              onCheck={(checked) => setChecked(checked)}
              onExpand={(expanded) => setExpanded(expanded)}
              icons={{
                check: <CheckBoxRounded />,
                uncheck: <CheckBoxOutlineBlankRounded />,
                halfCheck: (
                  <span className={classes.halfCheck}>
                    <CheckBoxRounded />
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

      <CancelModal
        text={t('UNARCHIVE_AKO_ROLE_CONFIRMATION')}
        open={openArchiveModal}
        onClose={() => setOpenArchiveModal(false)}
        onSubmit={handleUnArchive}
      />
    </Page>
  );
};
