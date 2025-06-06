import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import SaveRounded from '@mui/icons-material/SaveRounded';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../../Components/Global/Page';
import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import TableHeadCell from '../../Components/Tables/TableHeadCell';
import CancelModal from '../../Components/Modal/CancelModal';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import Toggle from '../../Components/Theme/Fields/Toggle';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import {
  useProcessSettingsListQuery,
  useProcessSettingsSettingsListQuery,
  useProcessSettingsSettingsUpdateMutation
} from './api';
import StickyTableHead from '../../Components/Theme/Table/StickyTableHead';

const defaultSearch = {
  text: ''
};

const ProcessSettings = () => {
  const { process_name } = useParams();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState(defaultSearch);
  const [saveList, setSaveList] = useState({});
  const [confirmModal, setConfirmModal] = useState({ open: false, text: t('ARE_U_SURE_U_WANT_TO_MAKE_CHANGES') });

  const timeout = useRef(null);
  const [params, setParams] = useState({});
  const [togglesList, setTogglesList] = useState(null);
  const { currentData: processList } = useProcessSettingsListQuery({});
  const { currentData, isFetching, isError } = useProcessSettingsSettingsListQuery({ process_name, params });
  const PAGE_NAME = processList?.data?.find((i) => i?.process === process_name.toUpperCase())?.process_ua;

  const [updateSettings, { isLoading }] = useProcessSettingsSettingsUpdateMutation();

  useEffect(() => {
    if (!togglesList && currentData?.enabled) {
      setTogglesList(
        Object.fromEntries(
          currentData.enabled.map((i) => {
            const toggleItem = { enabled: i.enabled };
            if (i.lock_historical_updates !== undefined) {
              toggleItem.lock_historical_updates = i.lock_historical_updates;
            }
            return [i.metering_grid_area, toggleItem];
          })
        )
      );
    }
  }, [togglesList, currentData]);

  const handleAreaSearch = ({ target }) => {
    const { name, value } = target;
    const newSearch = {
      ...search,
      [name]: value || undefined
    };

    setSearch(newSearch);
    clearTimeout(timeout.current);
    if (!value || value.length >= 3) {
      timeout.current = setTimeout(() => {
        setParams({
          ...newSearch,
          page: 1
        });
      }, 500);
    }
  };

  const changeToggle = ({ enabled, eic, field }) => {
    const updatedToggle = {
      ...togglesList?.[eic],
      [field]: enabled
    };

    setTogglesList({
      ...togglesList,
      [eic]: updatedToggle
    });

    setSaveList((prev) => {
      const existing = prev[eic] || {};
      if (prev[eic] && field in prev[eic]) {
        delete prev[eic][field];
        if (!Object.keys(prev[eic]).length) {
          delete prev[eic];
        }
        return prev;
      }
      const updated = { ...existing, [field]: enabled };
      return {
        ...prev,
        [eic]: updated
      };
    });
  };

  const handleToggle = (enabled, eic, field) => {
    if (enabled === 1) {
      setConfirmModal({ ...confirmModal, open: true, data: { enabled, eic, field } });
    } else {
      changeToggle({ enabled, eic, field });
    }
  };

  const IS_HISTORICAL_LOCK = Array.isArray(currentData?.enabled) && 'lock_historical_updates' in currentData.enabled[0];

  const handleSave = () => {
    updateSettings({ process_name, params: { ...search, size: 1000 }, body: saveList }).then(() => {
      enqueueSnackbar(t('NOTIFICATIONS.SETTINGS_CHANGED'), {
        key: new Date().getTime() + Math.random(),
        variant: 'success',
        autoHideDuration: 3000
      });
      setSaveList({});
    });
  };

  return (
    <Page
      acceptPermisions={'PROCESS_SETTINGS.ACCESS'}
      acceptRoles={['АКО_Процеси']}
      pageName={PAGE_NAME ? t('PAGES.PROCESS_SETTINGS_N', { name: PAGE_NAME }) : `${t('LOADING')}...`}
      backRoute={'/process-settings'}
      loading={isFetching || isLoading || !PAGE_NAME}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
      controls={
        <CircleButton
          icon={<SaveRounded />}
          color={'green'}
          title={t('SAVE_CHANGES')}
          dataMarker={'saveSettings'}
          onClick={handleSave}
          disabled={!Object.keys(saveList).length}
        />
      }
    >
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            <TableHeadCell title={t('FIELDS.AREA_NAME')}>
              <input name="text" value={search?.text || ''} onChange={handleAreaSearch} />
            </TableHeadCell>
            {currentData?.implemented_bs_processes && (
              <TableHeadCell title={t('FIELDS.BALANCE_SUPPLIER_PROCCESSES')} width={100} />
            )}
            {IS_HISTORICAL_LOCK && <TableHeadCell title={t('FIELDS.DATE_LIMIT')} width={100} />}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {currentData?.enabled?.length > 0 ? (
            currentData?.enabled.map((row) => (
              <TableRow key={row?.metering_grid_area} data-marker={'table-row'} className={'body__table-row'}>
                <TableCell>{row?.metering_grid_area_ua}</TableCell>
                {currentData?.implemented_bs_processes && (
                  <TableCell>
                    <Toggle
                      title={
                        togglesList?.[row?.metering_grid_area]?.enabled ? t('CONTROLS.TURN_OFF') : t('CONTROLS.TURN_ON')
                      }
                      size={'medium'}
                      color={togglesList?.[row?.metering_grid_area]?.enabled ? 'green' : 'red'}
                      dataMarker={'toggle-enabled'}
                      setSelected={(v) => handleToggle(v ? 1 : 0, row?.metering_grid_area, 'enabled')}
                      selected={Boolean(togglesList?.[row?.metering_grid_area]?.enabled)}
                    />
                  </TableCell>
                )}
                {row?.lock_historical_updates !== undefined && (
                  <TableCell>
                    <Toggle
                      title={
                        togglesList?.[row?.metering_grid_area]?.lock_historical_updates
                          ? t('CONTROLS.TURN_OFF')
                          : t('CONTROLS.TURN_ON')
                      }
                      size="medium"
                      color={togglesList?.[row?.metering_grid_area]?.lock_historical_updates ? 'green' : 'red'}
                      dataMarker="toggle-lock_historical_updates"
                      setSelected={(v) => handleToggle(v ? 1 : 0, row?.metering_grid_area, 'lock_historical_updates')}
                      selected={Boolean(togglesList?.[row?.metering_grid_area]?.lock_historical_updates)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <NotResultRow span={2} text={t('CONTROLS.NO_SETTINGS_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <CancelModal
        text={confirmModal.text}
        open={confirmModal.open}
        submitType={'green'}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        onSubmit={() => {
          changeToggle(confirmModal.data);
          setConfirmModal({ ...confirmModal, open: false });
        }}
      />
    </Page>
  );
};

export default ProcessSettings;
