import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { mainApi } from '../../../../app/mainApi';
import { setData } from '../slice';
import { useUpdateUpdateApsHistoryMutation } from '../api';
import PropertiesForm from './PropertiesForm';

const EditForm = () => {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const properties = useSelector((store) => store.updateApsHistory.data);

  const { currentData } = mainApi.endpoints.updateApsHistory.useQueryState(uid, { skip: !uid });

  const [, { error }] = useUpdateUpdateApsHistoryMutation({
    fixedCacheKey: 'updateApsHistory_update'
  });

  const onChange = (id, value) => {
    dispatch(setData({ ...properties, [id]: value }));
  };

  useEffect(() => {
    if (!properties && currentData?.properties) {
      dispatch(setData(Object.fromEntries(currentData?.properties.map((i) => [i.code, i.value]))));
    }
  }, [dispatch, properties, currentData?.properties]);

  return <PropertiesForm values={properties || {}} onChange={onChange} error={error} />;
};

export default EditForm;
