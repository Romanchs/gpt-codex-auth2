import SelectField from '../../Components/Theme/Fields/SelectField';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import TimelineTab from './TimelineTab';
import useViewDataLog from '../../services/actionsLog/useViewDataLog';
import { useParams } from 'react-router-dom';
import useSearchLog from '../../services/actionsLog/useSearchLog';
import { useTranslation } from 'react-i18next';

const SelectTimelineType = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [type, setType] = useState(null);

  const viewDataLog = useViewDataLog(['Реєстр ТКО'], 'ap', id);
  const searchLog = useSearchLog(['Реєстр ТКО']);

  useEffect(() => viewDataLog(), [viewDataLog]);

  const handleChangeType = (type) => {
    setType(type);
    searchLog();
  };

  return (
    <>
      <Box className={'boxShadow'} sx={{ borderRadius: 2, overflow: 'hidden', px: 3, pt: 2.5, pb: 2 }}>
        <Box sx={{ maxWidth: 400 }}>
          <SelectField
            label={t('FIELDS.TIMELINE_TYPE')}
            value={type}
            data={[
              { label: 'TIMELINE_TYPE.BY_DATE', value: 'by_date' },
              {
                label: 'TIMELINE_TYPE.BY_PERIOD',
                value: 'by_period'
              }
            ]}
            dataMarker={'timeline_type'}
            onChange={handleChangeType}
          />
        </Box>
      </Box>
      {type && <TimelineTab type={type} />}
    </>
  );
};

export default SelectTimelineType;
