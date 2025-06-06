import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CreateRounded from '@mui/icons-material/CreateRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import GetAppRounded from '@mui/icons-material/GetAppRounded';
import PlayCircleFilledWhiteRounded from '@mui/icons-material/PlayCircleFilledWhiteRounded';
import ThumbUpAltRounded from '@mui/icons-material/ThumbUpAltRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import UpdateRounded from '@mui/icons-material/UpdateRounded';
import AnnouncementRounded from '@mui/icons-material/AnnouncementRounded';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowDownwardRounded from '@mui/icons-material/ArrowDownwardRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import AutorenewRounded from '@mui/icons-material/AutorenewRounded';
import BlockRounded from '@mui/icons-material/BlockRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import DoneRounded from '@mui/icons-material/DoneRounded';
import HighlightOffRounded from '@mui/icons-material/HighlightOffRounded';
import NoteAddRounded from '@mui/icons-material/NoteAddRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PlaylistAddCheckRounded from '@mui/icons-material/PlaylistAddCheckRounded';
import PublishRounded from '@mui/icons-material/PublishRounded';
import RedoRounded from '@mui/icons-material/RedoRounded';
import RemoveRounded from '@mui/icons-material/RemoveRounded';
import ReplyRounded from '@mui/icons-material/ReplyRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import SendRounded from '@mui/icons-material/SendRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import UnarchiveRounded from '@mui/icons-material/UnarchiveRounded';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import RuleIcon from '@mui/icons-material/Rule';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import { LightTooltip } from '../Components/LightTooltip';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    '& svg': {
      fontSize: 16
    },
    [theme.breakpoints.down('xs')]: {
      width: 28,
      height: 28
    }
  },
  blue: {
    backgroundColor: '#223B82',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#223B82',
      borderColor: '#223B82'
    },
    '&.Mui-disabled': {
      opacity: 0.25,
      backgroundColor: '#223B82',
      color: '#fff'
    }
  },
  orange: {
    backgroundColor: '#F28C60',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#F28C60',
      borderColor: '#F28C60'
    },
    '&.Mui-disabled': {
      opacity: 0.25,
      backgroundColor: '#F28C60',
      color: '#fff'
    }
  },
  green: {
    backgroundColor: '#008C0C',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#008C0C',
      borderColor: '#008C0C'
    },
    '&.Mui-disabled': {
      opacity: 0.25,
      backgroundColor: '#008C0C',
      color: '#fff'
    }
  },
  white: {
    backgroundColor: '#fff',
    color: '#000',
    '&:hover': {
      backgroundColor: '#fff',
      borderColor: '#fff'
    },
    '&.Mui-disabled': {
      opacity: 0.5,
      backgroundColor: '#fff',
      color: '#000'
    }
  },
  red: {
    backgroundColor: '#f90000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#f90000',
      borderColor: '#f90000'
    },
    '&.Mui-disabled': {
      opacity: 0.25,
      backgroundColor: '#f90000',
      color: '#fff'
    }
  }
}));

const CircleButton = ({ onClick, type, title, disabled, component, size, dataMarker, dataStatus, icon, color }) => {
  const classes = useStyles();

  const getIcon = () => {
    switch (type) {
      case 'list':
        return <RuleIcon />;
      case 'download':
        return <GetAppRounded />;
      case 'circle-download':
        return <ArrowDownwardRounded />;
      case 'upload':
        return <PublishRounded />;
      case 'back':
        return <ArrowBackRounded />;
      case 'add':
        return <AddRounded />;
      case 'settings':
        return <SettingsRounded />;
      case 'send':
        return <SendRounded />;
      case 'loading':
        return <AutorenewRounded className={'rotating'} />;
      case 'create':
        return <PlayArrowRounded />;
      case 'refresh':
        return <AutorenewRounded />;
      case 'remove':
        return <HighlightOffRounded />;
      case 'next':
        return <ChevronRightRounded />;
      case 'link':
        return <ReplyRounded style={{ transform: 'scaleX(-1)' }} />;
      case 'delete':
        return <DeleteRounded />;
      case 'done':
        return <DoneRounded />;
      case 'details':
        return <VisibilityRounded />;
      case 'block':
        return <BlockRounded />;
      case 'document':
        return <DescriptionRounded />;
      case 'removeGreen':
        return <RemoveRounded />;
      case 'search':
        return <SearchRounded />;
      case 'check':
        return <PlaylistAddCheckRounded />;
      case 'new':
        return <NoteAddRounded />;
      case 'edit':
        return <CreateRounded />;
      case 'dispute':
        return <AnnouncementRounded />;
      case 'forward':
        return <ArrowForwardRounded />;
      case 'update':
        return <UpdateRounded />;
      case 'autorenew':
        return <AutorenewRounded />;
      case 'thumbup':
        return <ThumbUpAltRounded />;
      case 'toWork':
        return <PlayCircleFilledWhiteRounded />;
      case 'redo':
        return <RedoRounded />;
      case 'save':
        return <SaveRounded />;
      case 'unarchive':
        return <UnarchiveRounded />;
      case 'like':
        return <ThumbUpAltRoundedIcon />;
      case 'eventNote':
        return <EventNoteOutlinedIcon />;
      default:
        return <GetAppRounded />;
    }
  };

  const getStyle = () => {
    switch (type) {
      case 'download':
      case 'upload':
      case 'back':
      case 'link':
      case 'document':
      case 'search':
      case 'dispute':
      case 'eventNote':
        return classes.blue;
      case 'add':
      case 'send':
      case 'create':
      case 'refresh':
      case 'done':
      case 'details':
      case 'removeGreen':
      case 'new':
      case 'forward':
      case 'redo':
      case 'save':
      case 'unarchive':
      case 'like':
        return classes.green;
      case 'settings':
      case 'loading':
      case 'next':
      case 'list':
        return classes.white;
      case 'remove':
      case 'delete':
      case 'block':
        return classes.red;
      default:
        return classes.blue;
    }
  };

  return (
    <LightTooltip title={title} arrow disableTouchListener disableFocusListener data-marker={'tooltip'}>
      <span>
        <IconButton
          component={component || 'button'}
          onClick={onClick}
          size={size}
          className={clsx(classes.root, color ? classes[color] : getStyle())}
          disabled={disabled}
          data-marker={dataMarker || type}
          data-status={dataStatus || null}
        >
          {icon || getIcon()}
        </IconButton>
      </span>
    </LightTooltip>
  );
};

CircleButton.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.oneOf([
    'list',
    'download',
    'circle-download',
    'document',
    'upload',
    'back',
    'block',
    'add',
    'settings',
    'send',
    'loading',
    'create',
    'remove',
    'refresh',
    'next',
    'link',
    'delete',
    'done',
    'details',
    'search',
    'removeGreen',
    'new',
    'check',
    'edit',
    'dispute',
    'forward',
    'update',
    'autorenew',
    'thumbup',
    'toWork',
    'redo',
    'save',
    'unarchive',
    'like'
  ]),
  title: PropTypes.any,
  size: PropTypes.oneOf(['small', 'medium']),
  icon: PropTypes.any,
  color: PropTypes.oneOf(['green', 'blue', 'red', 'orange', 'white']),
  disabled: PropTypes.bool,
  dataMarker: PropTypes.string,
  dataStatus: PropTypes.string
};

export default CircleButton;
