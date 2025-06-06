import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';

export const StyledSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    marginRight: 12,
    marginLeft: 12
  },
  switchBase: {
    padding: 2,
    '&$checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + $track': {
        backgroundColor: '#008C0C',
        opacity: 1,
        border: 'none'
      }
    },
    '&$focusVisible $thumb': {
      color: '#008C0C',
      border: '6px solid #fff'
    }
  },
  thumb: {
    width: 22,
    height: 22
  },
  track: {
    borderRadius: 13,
    border: `none`,
    backgroundColor: '#FF4850',
    opacity: 1,
    transition: theme.transitions.create(['background-color'])
  },
  checked: {},
  focusVisible: {}
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      data-status={props?.checked ? 'on' : 'off'}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked
      }}
      {...props}
    />
  );
});
