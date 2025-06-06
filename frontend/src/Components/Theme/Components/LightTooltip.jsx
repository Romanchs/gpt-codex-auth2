import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

export const LightTooltip = styled(
	({ className, ...props }) => (
		<Tooltip
			{...props}
			classes={{ popper: className }}
		/>
	))
(
  ({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff'
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: '#4A5B7A',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      padding: '8px 12px',
      borderRadius: 16,
      fontSize: 12,
      maxWidth: 600
    }
  })
);
