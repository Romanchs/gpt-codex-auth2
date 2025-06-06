import { CONSTRUCTOR_ZV_LOG_TAGS, DIRECTORIES_LOG_TAGS, DISPUTES_LOG_TAGS, GTS_LOG_TAGS, INSTRUCTIONS_LOG_TAGS, METER_READING_LOG_TAGS, MONITORING_DKO_LOG_TAGS, PROCESSES_LOG_TAGS, REPORTS_LOG_TAGS, TIME_SERIES_LOG_TAGS, UPLOAD_ZV_LOG_TAGS, USERS_DIRECTORY_LOG_TAGS } from "./constants";

export const TAGS = {
    '/instructions': INSTRUCTIONS_LOG_TAGS,
    '/gts': GTS_LOG_TAGS,
    '/gts/files': GTS_LOG_TAGS,
    '/gts/reports': GTS_LOG_TAGS,
    '/gts/region-balance/': GTS_LOG_TAGS,
    '/meter-reading/view': METER_READING_LOG_TAGS,
    '/meter-reading/uploads': METER_READING_LOG_TAGS,
    '/time-series': TIME_SERIES_LOG_TAGS,
    '/users-directory': USERS_DIRECTORY_LOG_TAGS,
    '/directories': DIRECTORIES_LOG_TAGS,
    '/reports': REPORTS_LOG_TAGS,
    '/processes/mms/upload-zv': UPLOAD_ZV_LOG_TAGS,
    '/disputes': DISPUTES_LOG_TAGS,
    '/processes': PROCESSES_LOG_TAGS,
    '/monitoring-dko': MONITORING_DKO_LOG_TAGS,
    '/constructor-ZV': CONSTRUCTOR_ZV_LOG_TAGS
};