export interface VuiSettings {
    titleSuffix: string;
    logoSrc: string;
    defaultTheme: string;
    usePreferredColorScheme: boolean;
    alternateTheme: string;
    alternateLogo: string;
    codeTheme: string;
    googleMapsApiKey: string;
    mapboxAccessToken: string;
    googleAnalyticsPropertyId: string;
    palettes: Palettes;
    themes: Themes;
    fonts: Fonts;
    pointValuesLimit: number;
    autoLoginUsername: string;
    autoLoginPassword: string;
    userModule: string;
    userCss: string;
    eventAudioFiles: EventAudioFiles;
    eventReadAloud: Event;
    eventNotify: Event;
    timeouts: Timeouts;
    pwaManifest: PwaManifest;
    pwaUseThemeColors: boolean;
    pwaAutomaticName: string;
    pwaAutomaticNamePrefix: string;
    dateFormats: DateFormats;
    showUnacknowlegedEventsIcon: boolean;
}

export interface DateFormats {
    dateTime: string;
    shortDateTime: string;
    dateTimeSeconds: string;
    shortDateTimeSeconds: string;
    date: string;
    shortDate: string;
    time: string;
    timeSeconds: string;
    monthDay: string;
    month: string;
    year: string;
}

export interface EventAudioFiles {
    NONE: string;
    INFORMATION: string;
    IMPORTANT: string;
    WARNING: string;
    URGENT: string;
    CRITICAL: string;
    LIFE_SAFETY: string;
    DO_NOT_LOG: string;
}

export interface Event {
    NONE: boolean;
    INFORMATION: boolean;
    IMPORTANT: boolean;
    WARNING: boolean;
    URGENT: boolean;
    CRITICAL: boolean;
    LIFE_SAFETY: boolean;
    DO_NOT_LOG: boolean;
}

export interface Fonts {
    default: string;
    heading: string;
    paragraph: string;
    code: string;
}

export interface Palettes {
    'mango-orange': MangoBackground2020_Class;
    'mango-blue': MangoBackground2020_Class;
    'mango-blue-2020': MangoBackground2020_Class;
    'mango-orange-2020': MangoBackground2020_Class;
    'mango-background-2020': MangoBackground2020_Class;
}

export interface MangoBackground2020_Class {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
    A100: string;
    A200: string;
    A400: string;
    A700: string;
    contrastDefaultColor: string;
    contrastDarkColors: string;
}

export interface PwaManifest {
    name: string;
    start_url: string;
    display: string;
    theme_color: string;
    background_color: string;
    icons: Icon[];
}

export interface Icon {
    src: string;
    sizes: string;
    type: string;
}

export interface Themes {
    mangoLight: MangoDarkClass;
    mangoDark: MangoDarkClass;
    userTheme: UserTheme;
    mangoDark2020: Mango2020;
    mangoLight2020: Mango2020;
}

export interface MangoDarkClass {
    primaryPalette: string;
    primaryPaletteHues: PaletteHues;
    accentPalette: string;
    accentPaletteHues: PaletteHues;
    dark: boolean;
}

export interface PaletteHues {
    default: string;
    'hue-1': string;
    'hue-2': string;
    'hue-3': string;
}

export interface Mango2020 {
    primaryPalette: string;
    primaryPaletteHues: PaletteHues;
    accentPalette: string;
    accentPaletteHues: PaletteHues;
    backgroundPalette: string;
    backgroundPaletteHues: PaletteHues;
    dark: boolean;
}

export interface UserTheme {
    primaryPalette: string;
    accentPalette: string;
    warnPalette: string;
    backgroundPalette: string;
    dark: boolean;
}

export interface Timeouts {
    xhr: number;
    websocket: number;
    websocketRequest: number;
    pointValues: number;
    watchdogStatusDelay: number;
    moduleUpload: number;
}
