const constantsObj = () => {
    return {
        MA_BASE_URL: '',
        MA_TIMEOUTS: {
            // NOTE: update uiSettings.json as well! These timeouts are overridden by the timeouts in the UI Settings
            xhr: 30000, // default XMLHttpRequest timeout
            websocket: 10000, // WebSocket connection timeout
            websocketRequest: 10000, // request made over WebSocket
            pointValues: 60000, // timeout for fetching points values
            watchdogStatusDelay: 30000, // delay between status checks when the API is down
            moduleUpload: 300000 // timeout for uploading modules on the offline upgrades page
        },

        // These are Moment.js format strings https://momentjs.com/docs/#/displaying/format/
        // They can be configured via UI Settings
        MA_DATE_FORMATS: {
            dateTime: 'lll',
            shortDateTime: 'l LT',
            dateTimeSeconds: 'll LTS',
            shortDateTimeSeconds: 'l LTS',
            date: 'll',
            shortDate: 'l',
            time: 'LT',
            timeSeconds: 'LTS',
            monthDay: 'MMM D',
            month: 'MMM',
            year: 'YYYY',
            iso: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
            isoUtc: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
        },

        MA_ROLLUP_TYPES: [
            { type: 'POINT_DEFAULT', nonNumeric: true, label: 'Point default', translation: 'common.rollup.pointDefault', nonAssignable: true },
            { type: 'NONE', nonNumeric: true, label: 'None', translation: 'common.rollup.none' },
            { type: 'SIMPLIFY', nonNumeric: false, label: 'Simplify', translation: 'ui.app.simplify', nonAssignable: true },
            { type: 'AVERAGE', nonNumeric: false, label: 'Average', translation: 'common.rollup.average' },
            { type: 'DELTA', nonNumeric: false, label: 'Delta', translation: 'common.rollup.delta' },
            { type: 'MINIMUM', nonNumeric: false, label: 'Minimum', translation: 'common.rollup.minimum' },
            { type: 'MAXIMUM', nonNumeric: false, label: 'Maximum', translation: 'common.rollup.maximum' },
            { type: 'ACCUMULATOR', nonNumeric: false, label: 'Accumulator', translation: 'common.rollup.accumulator' },
            { type: 'SUM', nonNumeric: false, label: 'Sum', translation: 'common.rollup.sum' },
            { type: 'START', nonNumeric: true, label: 'Start', translation: 'common.rollup.start' },
            { type: 'FIRST', nonNumeric: true, label: 'First', translation: 'common.rollup.first' },
            { type: 'LAST', nonNumeric: true, label: 'Last', translation: 'common.rollup.last' },
            { type: 'COUNT', nonNumeric: true, label: 'Count', translation: 'common.rollup.count' },
            { type: 'INTEGRAL', nonNumeric: false, label: 'Integral', translation: 'common.rollup.integral' },
            { type: 'ARITHMETIC_MEAN', nonNumeric: false, label: 'Arithmetic mean', translation: 'common.rollup.arithmeticMean' },
            { type: 'MINIMUM_IN_PERIOD', nonNumeric: false, label: 'Minimum (in period)', translation: 'common.rollup.minimumInPeriod' },
            { type: 'MAXIMUM_IN_PERIOD', nonNumeric: false, label: 'Maximum (in period)', translation: 'common.rollup.maximumInPeriod' },
            { type: 'RANGE_IN_PERIOD', nonNumeric: false, label: 'Range (in period)', translation: 'common.rollup.rangeInPeriod' }
            // {name: 'FFT', nonNumeric: false}
        ],

        // These are Java SimpleDateFormat format strings and are only used on the Watchlist download page
        MA_DATE_TIME_FORMATS: [
            {
                translation: 'vui.app.timeFormat.iso',
                format: "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
            },
            {
                translation: 'vui.app.timeFormat.excelCompatible',
                format: 'yyyy-MM-dd HH:mm:ss'
            },
            {
                translation: 'vui.app.timeFormat.excelCompatibleMs',
                format: 'yyyy-MM-dd HH:mm:ss.SSS'
            },
            {
                translation: 'vui.app.timeFormat.epoch',
                format: ''
            }
        ],

        MA_TIME_PERIOD_TYPES: [
            { type: 'MILLISECONDS', label: 'Milliseconds', translation: 'dateAndTime.milliseconds', perTranslation: 'dateAndTime.millisecond.per' },
            { type: 'SECONDS', label: 'Seconds', translation: 'dateAndTime.seconds', perTranslation: 'dateAndTime.second.per' },
            { type: 'MINUTES', label: 'Minutes', translation: 'dateAndTime.minutes', perTranslation: 'dateAndTime.minute.per' },
            { type: 'HOURS', label: 'Hours', translation: 'dateAndTime.hours', perTranslation: 'dateAndTime.hour.per' },
            { type: 'DAYS', label: 'Days', translation: 'dateAndTime.days', perTranslation: 'dateAndTime.day.per', showByDefault: true },
            { type: 'WEEKS', label: 'Weeks', translation: 'dateAndTime.weeks', perTranslation: 'dateAndTime.week.per', showByDefault: true },
            { type: 'MONTHS', label: 'Months', translation: 'dateAndTime.months', perTranslation: 'dateAndTime.month.per', showByDefault: true },
            { type: 'YEARS', label: 'Years', translation: 'dateAndTime.years', perTranslation: 'dateAndTime.year.per', showByDefault: true }
        ],

        MA_CHART_TYPES: [
            { type: 'line', apiType: 'LINE', label: 'Line', translation: 'ui.app.line' },
            { type: 'smoothedLine', apiType: 'SPLINE', label: 'Smoothed', translation: 'ui.app.smooth' },
            { type: 'step', apiType: 'STEP', label: 'Step', translation: 'ui.app.step', nonNumeric: true },
            { type: 'column', apiType: 'BAR', label: 'Bar', translation: 'ui.app.bar' }
        ],

        MA_SIMPLIFY_TYPES: [
            { type: 'NONE', translation: 'pointEdit.simplify.none', dataTypes: new Set(['BINARY', 'ALPHANUMERIC', 'MULTISTATE', 'NUMERIC']) },
            { type: 'TARGET', translation: 'pointEdit.simplify.target', dataTypes: new Set(['NUMERIC', 'MULTISTATE', 'BINARY']) },
            { type: 'TOLERANCE', translation: 'pointEdit.simplify.tolerance', dataTypes: new Set(['NUMERIC', 'MULTISTATE', 'BINARY']) }
        ],

        MA_LIFECYCLE_STATES: {
            PRE_INITIALIZE: { translation: 'common.lifecycle.state.PRE_INITIALIZE', class: 'md-secondary' },
            INITIALIZING: { translation: 'common.lifecycle.state.INITIALIZING', class: 'md-secondary' },
            RUNNING: { translation: 'common.lifecycle.state.RUNNING', class: 'md-secondary' },
            TERMINATING: { translation: 'common.lifecycle.state.TERMINATING', class: 'md-warn' },
            TERMINATED: { translation: 'common.lifecycle.state.TERMINATED', class: 'md-warn' }
        },

        // properties are added/defined in UI module
        MA_EVENT_LINK_INFO: {},

        MA_DEFAULT_TIMEZONE: '',
        MA_DEFAULT_LOCALE: '',

        // development mode settings
        MA_DEVELOPMENT_CONFIG: { enabled: false }
    };
};

export default constantsObj();
