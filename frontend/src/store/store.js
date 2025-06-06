import { configureStore } from '@reduxjs/toolkit';

import disputesReducer from '../features/disputes/disputes.slice';
import forms from '../Forms/formReducer';
import admin from '../reducers/adminReducer';
import directories from '../reducers/directoryReducer';
import eos from '../reducers/endOfSupplyReducer';
import global from '../reducers/globalReducer';
import gts from '../reducers/gtsReducer';
import instructions from '../reducers/InstructionsReducer';
import massLoad from '../reducers/massLoadReducer';
import mms from '../reducers/mmsReducer';
import notistack from '../reducers/notistackReducer';
import passwords from '../reducers/passwordReducer';
import pon from '../reducers/ponReducer';
import ppko from '../reducers/PpkoReducer';
import processes from '../reducers/processesReducer';
import suppliers from '../reducers/suppliersReducer';
import timeSeries from '../reducers/TimeSeriesReducer';
import tko from '../reducers/tkoReducer';
import user from '../reducers/userReducer';
import zv from '../reducers/zvReducer';
import apiMiddleware from './apiMiddleware';
import apiToolkitMiddleware from './apiToolkitMiddleware';
import { mainApi } from '../app/mainApi';
import timelineSelectorReducer from '../features/tko/slice';
import cancelPPKOReducer from '../features/processes/cancelPPKO/slice';
import deletingTkoReducer from '../features/processes/deletingTko/slice';
import changePPKOReducer from '../features/processes/changePPKO/slice';
import gtsReducer from '../Components/pages/GTS/slice';
import endOfSupplyReducer from '../Components/pages/Processes/EndOfSupply/slice';
import updateApsHistoryReducer from '../features/processes/updateApsHistory/slice';
import notificationsReducer from '../features/notifications/slice';
import meterReadingReducer from '../features/meterReading/slice';
import auditsReducer from '../features/audit/slice';
import loggerReducer from '../services/loggerSlice';
import monitoringDkoReducer from '../features/monitoringDko/slice';
import changePaymentTypeReducer from '../features/processes/changePaymentType/slice';
import correctionArchivingTSReducer from '../features/processes/correctionArchivingTS/slice';
import requestArchivingTSReducer from '../features/processes/requestArchivingTS/slice';
import faqReducer from '../features/faq/slice';
import requestCorrectionTSReducer from '../features/processes/requestCorrectionTS/slice';
import securityHandlerReducer from '../services/securityHandler/slice';
import processSettingsReducer from '../features/ps/slice';
import consistencyMonitoringDetailsReducer from '../features/techWork/ConsistencyMonitoring/slice';
import accountingServiceCompletionReducer from '../features/processes/accountingServiceCompletion/slice';
import publicationCMDReducer from '../features/publicationCMD/slice';

const middlewares = [mainApi.middleware, apiMiddleware, apiToolkitMiddleware];

export const store = configureStore({
  reducer: {
    [mainApi.reducerPath]: mainApi.reducer,
    global,
    tko,
    ppko,
    massLoad,
    user,
    admin,
    passwords,
    processes,
    directories,
    pon,
    eos,
    timeSeries,
    instructions,
    notistack,
    forms,
    mms,
    suppliers,
    gts,
    zv,
    disputes: disputesReducer,
    timelineSelector: timelineSelectorReducer,
    cancelPPKO: cancelPPKOReducer,
    deletingTko: deletingTkoReducer,
    changePPKO: changePPKOReducer,
    gtsSlice: gtsReducer,
    endOfSupply: endOfSupplyReducer,
    updateApsHistory: updateApsHistoryReducer,
    notifications: notificationsReducer,
    meterReading: meterReadingReducer,
    logger: loggerReducer,
    audits: auditsReducer,
    monitoringDko: monitoringDkoReducer,
    changePaymentType: changePaymentTypeReducer,
    correctionArchivingTS: correctionArchivingTSReducer,
    requestArchivingTS: requestArchivingTSReducer,
    faq: faqReducer,
    securityHandler: securityHandlerReducer,
    requestCorrectionTS: requestCorrectionTSReducer,
    processSettings: processSettingsReducer,
    consistencyMonitoringDetails: consistencyMonitoringDetailsReducer,
    accountingServiceCompletion: accountingServiceCompletionReducer,
    publicationCMD: publicationCMDReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(middlewares)
});
