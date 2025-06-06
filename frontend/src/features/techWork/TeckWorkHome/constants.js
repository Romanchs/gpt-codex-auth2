import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HandymanIcon from '@mui/icons-material/Handyman';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';

export const menuItems = [
  {
    title: 'PAGES.TECHNICAL_WORK_ADMINISTRATION',
    path: '/tech/administration',
    icon: <MiscellaneousServicesIcon />,
    order: 1
  },
  {
    title: 'PAGES.E_CONSUMER_ADMINISTRATION',
    path: '/tech/e-customer',
    icon: <ManageAccountsIcon />,
    order: 2
  },
  {
    title: 'PAGES.DATA_CONSISTENCY_MONITORING',
    path: '/tech/consistency-monitoring', // TODO: allow on maintenance on no?
    icon: <LeaderboardRoundedIcon />,
    order: 3
  },
  {
    title: 'PAGES.PROCESS_QUALITY_MONITORING',
    path: '/processes?mode=tech-works',
    icon: <HandymanIcon />,
    order: 4
  }
];

export const allowedRoutesOnMaintenance = ['/tech', '/tech/administration', '/tech/e-customer'];
