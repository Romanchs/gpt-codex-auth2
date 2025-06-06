import AnnouncementRounded from '@mui/icons-material/AnnouncementRounded';
import AccountBalanceRounded from '@mui/icons-material/AccountBalanceRounded';
import AssessmentRounded from '@mui/icons-material/AssessmentRounded';
import BuildRounded from '@mui/icons-material/BuildRounded';
import DnsRounded from '@mui/icons-material/DnsRounded';
import GroupRounded from '@mui/icons-material/GroupRounded';
import HelpRounded from '@mui/icons-material/HelpRounded';
import LocalLibraryRounded from '@mui/icons-material/LocalLibraryRounded';
import MenuBookRounded from '@mui/icons-material/MenuBookRounded';
import PermContactCalendarRounded from '@mui/icons-material/PermContactCalendarRounded';
import SchoolRounded from '@mui/icons-material/SchoolRounded';
import StorageRounded from '@mui/icons-material/StorageRounded';
import WindPowerRounded from '@mui/icons-material/WindPowerRounded';
import WatchLaterRounded from '@mui/icons-material/WatchLaterRounded';
import WorkRounded from '@mui/icons-material/WorkRounded';
import DeveloperBoardRounded from '@mui/icons-material/DeveloperBoardRounded';
import ViewQuiltRounded from '@mui/icons-material/ViewQuiltRounded';
import TransformRoundedIcon from '@mui/icons-material/TransformRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import { DISPUTE_ALLOWED_ROLES } from '../features/disputes/constants';
import { getFeature } from '../util/getFeature';
import { checkOneOfPermissions, checkPermissions, showInitProcess } from '../util/verifyRole';
import { AUDITS_READ_PERMISSION, AUDITS_READ_ROLES } from '../features/audit';
import { PROCESSES_LIST_ACCEPT_ROLES } from '../features/processes/List';
import { accessToFaq } from '../features/faq/utils';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {
  PUBLICATION_CMD_ACCEPT_PERMISION,
  PUBLICATION_CMD_ACCEPT_ROLES
} from '../features/publicationCMD';
import { IS_PROD } from '../util/getEnv';

const useMenu = (flat) => {
  const data = {
    informData: [
      {
        id: 'tko',
        title: 'FAQ_TYPE.TKO',
        path: '/tko',
        icon: <DnsRounded />,
        visible: checkPermissions('TKO.ACCESS', ['АР (перегляд розширено)', 'АР', 'Адміністратор АР', 'АКО/АР_ZV', 'Третя сторона'], true),
        order: 1
      },
      {
        id: 'ppko',
        title: 'FAQ_TYPE.PPKO',
        path: '/ppko',
        icon: <DnsRounded />,
        visible: checkPermissions('PPKO.ACCESS', ['АКО_Суперечки', 'АКО_Перевірки', 'ГарПок'], true),
        order: 2
      },
      {
        id: 'audit',
        title: 'PAGES.AUDITS',
        path: '/audits',
        icon: <DnsRounded />,
        visible: checkPermissions(AUDITS_READ_PERMISSION, AUDITS_READ_ROLES),
        order: 3
      },
      {
        id: 'directories',
        title: 'FAQ_TYPE.DIRECTORIES',
        path: '/directories',
        icon: <MenuBookRounded />,
        visible: checkPermissions('DIRECTORIES.ACCESS', ['АКО...', 'АТКО', 'ГарПок', 'СВБ', 'ОДКО', 'ОЗКО', 'ОМ']),
        order: 4
      },
      {
        id: 'instructions',
        title: 'FAQ_TYPE.INSTRUCTIONS',
        path: '/instructions',
        icon: <SchoolRounded />,
        visible: true,
        order: 5
      },
      {
        id: 'reports',
        title: 'FAQ_TYPE.REPORTS',
        path: '/reports',
        icon: <AssessmentRounded />,
        visible: checkPermissions('REPORTS.ACCESS', ['АКО_Суперечки', 'АР (перегляд розширено)'], true),
        order: 6
      },
      {
        id: 'suppliers',
        title: 'FAQ_TYPE.MARKET_PARTICIPANT',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/suppliers',
        icon: <WorkRounded />,
        visible: checkPermissions('SUPPLIERS.ACCESS', ['АР (перегляд розширено)', 'АР', 'Адміністратор АР', 'АКО_Користувачі']),
        order: 7
      },
      {
        id: 'zv',
        title: 'FAQ_TYPE.ZV',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/zv',
        icon: <LocalLibraryRounded />,
        visible: checkPermissions('ZV.ACCESS', ['АКО', 'АКО_Процеси', 'АКО_ППКО', 'АКО_Користувачі', 'АКО_Довідники']),
        order: 8
      },
      {
        id: 'gts',
        title: 'FAQ_TYPE.GTS',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: checkPermissions('GTS.FUNCTIONS.REDIRECT_TO_REPORTS', ['АР (перегляд розширено)'])
          ? '/gts/reports'
          : '/gts',
        icon: <WatchLaterRounded />,
        visible: checkPermissions('GTS.ACCESS', [
          'АКО',
          'АКО_Довідники',
          'АКО_Процеси',
          'АКО_Користувачі',
          'АКО_ППКО',
          'АКО_Суперечки',
          'ОДКО',
          'АДКО',
          'ВТКО',
          'СВБ',
          'ОМ',
          'АР (перегляд розширено)'
        ]),
        order: 9
      },
      {
        id: 'disputes',
        title: 'PAGES.DISPUTES',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/disputes',
        icon: <AnnouncementRounded />,
        visible: checkPermissions('DISPUTES.ACCESS', DISPUTE_ALLOWED_ROLES),
        order: 10
      },
      {
        id: 'process-manager',
        title: 'FAQ_TYPE.PROCESS_MANAGER',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/process-manager',
        icon: <AccountBalanceRounded />,
        visible: checkPermissions('PROCESS_MANAGER.ACCESS', 'АКО_Процеси'),
        order: 11
      },
      {
        id: 'process-settings',
        title: 'FAQ_TYPE.PROCESS_SETTINGS',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/process-settings',
        icon: <BuildRounded />,
        visible: checkPermissions('PROCESS_SETTINGS.ACCESS', ['АКО_Процеси', 'АКО_Користувачі']),
        order: 12
      },
      {
        id: 'faq',
        title: 'PAGES.FAQ',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/faq',
        icon: <HelpRounded />,
        visible: accessToFaq(),
        order: 13
      },
      {
        id: 'time-series',
        title: 'PAGES.TIME_SERIES',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/time-series',
        icon: <WindPowerRounded />,
        visible: checkPermissions('TIME_SERIES.ACCESS', ['АКО', 'ОДКО']),
        order: 14
      },
      {
        id: 'monitoring-dko',
        title: 'MONITORING_DKO',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/monitoring-dko',
        icon: <DeveloperBoardRounded />,
        visible: checkPermissions('MONITORING_DKO.ACCESS', ['АКО', 'АКО_Процеси', 'ОДКО']),
        order: 15
      },
      {
        id: 'constructor-ZV',
        title: 'FAQ_TYPE.CONSTRUCTOR_ZV',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/constructor-ZV',
        icon: <ViewQuiltRounded />,
        visible: checkPermissions('CONSTRUCTOR_ZV.ACCESS', 'АКО_Процеси'),
        order: 16
      },
      {
        id: 'users-directory',
        title: 'PAGES.USERS_DIRECTORY',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/users-directory',
        icon: <GroupRounded />,
        visible: checkPermissions('USERS_DIRECTORY.ACCESS', ['АТКО', 'ОДКО', 'ОЗКО', 'ОЗД', 'ОМ', 'СВБ']),
        order: 17
      },
      {
        id: 'meter-reading',
        title: 'FAQ_TYPE.METER_READING',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/meter-reading/view',
        icon: <TransformRoundedIcon />,
        visible:
          checkPermissions('METER_READING.ACCESS', [
            'СВБ',
            'АКО_Процеси',
            'АКО_ППКО',
            'АКО_Суперечки',
            'АТКО',
            'ОЗД',
            'ОДКО',
            'АДКО',
            'ОЗКО'
          ]),
        order: 18
      },
      {
        id: 'actions-log',
        title: 'PAGES.ACTIONS_LOG',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/actions-log',
        icon: <PendingActionsRoundedIcon />,
        visible: checkPermissions('ACTIONS_LOG.ACCESS', ['АКО_Процеси', 'АКО_Суперечки']),
        order: 19
      },
      {
        id: 'publication-cmd',
        title: 'PAGES.PUBLICATION_CMD',
        description: 'FAQ_TYPE.SHORT_TEXT',
        path: '/publication-cmd',
        icon: <SendRoundedIcon />,
        visible: checkPermissions(PUBLICATION_CMD_ACCEPT_PERMISION, PUBLICATION_CMD_ACCEPT_ROLES) && !IS_PROD,
        order: 20
      }
    ],
    adminData: [
      {
        id: 'admin',
        title: 'FAQ_TYPE.ADMIN',
        icon: <GroupRounded />,
        visible: checkOneOfPermissions(
          ['USER_MANAGE.ACCESS', 'ROLES_MANAGE.ACCESS'],
          ['АКО', 'АКО_Процеси', 'АКО_ППКО', 'АКО_Користувачі', 'АКО_Довідники']
        ),
        // (getFeature('rolesManage') && checkPermissions('ROLES_MANAGE.ACCESS', ['АКО_Користувачі'])),
        subMenu: [
          {
            id: 'user-manage',
            title: 'FAQ_TYPE.USERS',
            path: '/admin/user',
            icon: <GroupRounded />,
            visible: checkPermissions('USER_MANAGE.ACCESS', [
              'АКО',
              'АКО_Процеси',
              'АКО_ППКО',
              'АКО_Користувачі',
              'АКО_Довідники'
            ])
          },
          {
            id: 'roles-manage',
            title: 'FAQ_TYPE.ROLES',
            path: '/admin/roles-manage',
            icon: <PermContactCalendarRounded />,
            visible: getFeature('rolesManage') && checkPermissions('ROLES_MANAGE.ACCESS', ['АКО_Користувачі'])
          }
        ],
        order: 6
      },
      {
        id: 'init-processes',
        hideOnHome: true,
        title: 'PROCESSES.INIT_PROCESSES',
        visible: showInitProcess([
          'СВБ',
          'АКО',
          'АКО_Процеси',
          'АКО_ППКО',
          'АКО_Користувачі',
          'АКО_Довідники',
          'ОДКО',
          'АДКО',
          'АТКО',
          'ВТКО',
          'СПМ',
          'ОЗД',
          'ОЗКО',
          'ГарПок',
          'АКО/АР_ZV'
        ]),
        order: 7
      },
      {
        id: 'processes',
        title: 'PAGES.PROCESSES',
        path: '/processes',
        icon: <StorageRounded />,
        visible: checkPermissions('PROCESSES.LIST.ACCESS', PROCESSES_LIST_ACCEPT_ROLES),
        order: 8
      }
    ]
  };

  if (flat) {
    return Object.values(data)
      .flat(Infinity)
      .filter((s) => s.visible)
      .sort((a, b) => a.order - b.order);
  } else {
    const clearData = {};
    Object.keys(data).forEach((i) => {
      clearData[i] = data[i].filter((s) => s.visible);
    });

    return clearData;
  }
};

export default useMenu;
