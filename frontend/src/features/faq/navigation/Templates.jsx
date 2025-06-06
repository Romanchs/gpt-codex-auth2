import { useFaqTemplatesQuery } from '../api';
import { useFaqLanguage } from '../slice';
import { CircularProgress } from '@material-ui/core';
import { Box, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { memo, useContext, useMemo, useState } from 'react';
import { MOCK_UID, STATUS } from '../data';
import { useNavigate, useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PageContext } from './Page';
import MoreMenu from './MoreMenu';
import { useIsFaqAdmin } from '../utils';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

const Templates = () => {
  const { t } = useTranslation();
  const { apiKey } = useContext(PageContext);
  const language = useFaqLanguage();
  const isAdmin = useIsFaqAdmin();
  const { data, isFetching } = useFaqTemplatesQuery({ language }, { skip: !isAdmin });

  const templates = useMemo(() => {
    let templatesByKey = data?.filter((t) => t.key === apiKey) || [];
    const hasDefault = templatesByKey.some((t) => t.status === STATUS.DEFAULT);
    if (!hasDefault) {
      templatesByKey.unshift({
        uid: MOCK_UID,
        template_name: t('DEFAULT'),
        status: STATUS.DEFAULT
      });
    }
    return templatesByKey
      .sort((a) => (a.status === STATUS.PUBLISHED ? -1 : 1))
      .sort((a) => (a.status === STATUS.DEFAULT ? -1 : 1));
  }, [data, apiKey]);

  if (isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={21} />
      </Box>
    );
  }

  return templates.map((t) => <Template data={t} key={t?.uid || MOCK_UID} />);
};

export default Templates;

const Template = memo(({ data }) => {
  const { status, template_name } = data;
  const { isActive, baseRoute } = useContext(PageContext);
  const navigate = useNavigate();
  const { uid } = useParams();
  const isDefault = status === STATUS.DEFAULT;
  const isDraft = status === STATUS.DRAFT;
  const isSelected = uid === data?.uid && isActive;
  const [element, setElement] = useState(null);

  const handleClick = () => {
    navigate(baseRoute + '/' + data?.uid);
  };

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" size="small" onClick={(e) => setElement(e.currentTarget)} data-marker={'more-menu'}>
          <MoreVertIcon fontSize={'small'} />
        </IconButton>
      }
      disablePadding
      sx={{ p: 0 }}
    >
      <ListItemButton onClick={handleClick} sx={{ py: 0, pr: 1, pl: 5 }} dense role={undefined}>
        <ListItemText>
          {isDraft && (
            <Typography
              component={'span'}
              sx={{
                color: '#A9B9C6',
                fontWeight: 500,
                mr: 0.5,
                fontSize: 10
              }}
            >
              {t('DRAFT')}
            </Typography>
          )}
          <Typography
            component={'span'}
            sx={{
              color: isSelected ? '#F28C60' : '#4A5B7A',
              fontWeight: isDefault ? 700 : 500
            }}
          >
            {isDefault ? t('DEFAULT') : template_name}
          </Typography>
        </ListItemText>
      </ListItemButton>
      <MoreMenu data={data} baseRoute={baseRoute} anchorEl={element} handleClose={() => setElement(null)} />
    </ListItem>
  );
});
