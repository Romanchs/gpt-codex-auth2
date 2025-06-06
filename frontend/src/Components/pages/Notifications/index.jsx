import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import Page from "../../Global/Page";
import CircleButton from "../../Theme/Buttons/CircleButton";
import Toggle from '../../Theme/Fields/Toggle';
import {getProcesses, getText} from "./data";
import DataTable from './DataTable';
import { useTranslation } from "react-i18next";

const Notifications = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {loading} = useSelector(({processes}) => processes);

  const TEXTS = getText();

  const [data, setData] = useState({
    current_page: 1,
    next_page: 2,
    data: getProcesses({page: 1, size: 25}),
    previous_page: null,
    total: getProcesses({size: -1}).length || 0
  });

  const renderToggle = level => (active, {uid}) => (
    <Toggle
      disabled={uid > 8}
      title={uid > 8 ? '' : active ? t('NOTIFICATIONS.TORN_OFF_NOTIFICATIONS_NAME', {name: `${level}${uid}`}) : t('NOTIFICATIONS.TORN_ON_NOTIFICATIONS_NAME', {name: `${level}${uid}`})}
      size={'small'}
      color={level === 1 ? 'green' : level === 2 ? 'orange' : 'red'}
      dataMarker={`notify-toggle-${level}-${uid}`}
      setSelected={(v) => {
        setData({
          ...data,
          data: data.data.map(i => i.uid === uid
            ? {...i, ['toggle' + level]: v}
            : i
          )
        });
      }}
      selected={active}
    />
  );
  const renderHead = label => <p>{label}</p>;
  const columns = [
    { id: 'title', label: t('PROCESS_NAME'), minWidth: 150 },
    { id: 'toggle1', label: t('NOTIFICATION_TYPE', {id: 1}), minWidth: 50, renderHead, renderBody: renderToggle(1) },
    { id: 'toggle2', label: t('NOTIFICATION_TYPE', {id: 2}), minWidth: 50, renderHead, renderBody: renderToggle(2) },
    { id: 'toggle3', label: t('NOTIFICATION_TYPE', {id: 3}), minWidth: 50, renderHead, renderBody: renderToggle(3) }
  ];

  const handleUpdateTable = ({title, size, page}) => {
    const search = title?.toLowerCase();

    const list = search
    ? getProcesses({size: -1})
      ?.filter(({title}) => title.toLowerCase().includes(search))
      .filter((v, i) => i >= (page - 1) * size && i < page * size)
    : data.data;

    setData({...data, data: list, total: list.length});
  };

  return (
    <Page
      pageName={TEXTS.pageTitle}
      backRoute={'/processes'}
      loading={loading}
      controls={
        <CircleButton
          type={'update'}
          title={TEXTS.buttonResetAll}
          onClick={() => true}
          disabled={loading}
        />
      }
    >
      {/* Вспылвающая подсказка внизу слева, что изменения сохранены
      (зелёная нотификация через actions)
      (по клику на переключатель сохраняются данные) */}
      <DataTable
        type={'search'}
        loading={loading}
        columns={columns}
        uploadData={handleUpdateTable}
        initialData={data}
        emptyResult={t('PROCESSES_NOT_FOUND')}
        externalData={data}
      />
    </Page>
  );
};

export default Notifications;
