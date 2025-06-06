import { Tab, Tabs, withStyles } from '@material-ui/core';

export const DHTabs2 = ({ sx, ...props }) => (
  <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginBottom: 16, ...sx }}>
    <DHTabs {...props} />
  </div>
);

export const DHTabs = withStyles({
  indicator: {
    backgroundColor: '#223B82',
    height: 3
  }
})((props) => <Tabs variant="scrollable" scrollButtons={'auto'} {...props} />);

export const DHTab = withStyles((theme) => ({
  root: {
    paddingLeft: 20,
    paddingRight: 20,
    minWidth: 0,
    // width: 'auto',
    fontSize: 12,
    lineHeight: 1.3,
    minHeight: 64,
    color: '#223B82',
    opacity: 0.5,
    '&:hover': {
      color: '#223B82',
      opacity: 1
    },
    '&$selected': {
      color: '#223B82',
      fontWeight: theme.typography.fontWeightMedium
    },
    '&:focus': {
      color: '#223B82'
    }
  },
  selected: {}
}))((props) => <Tab disableRipple {...props} />);
