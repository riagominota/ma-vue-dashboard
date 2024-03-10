export interface UISettings {
    titleSuffix:                 string;
    logoSrc:                     string;
    defaultTheme:                string;
    usePreferredColorScheme:     boolean;
    alternateTheme:              string;
    alternateLogo:               string;
    codeTheme:                   string;
    googleMapsApiKey:            string;
    mapboxAccessToken:           string;
    googleAnalyticsPropertyId:   string;
    palettes:                    Palettes;
    themes:                      Themes;
    fonts:                       Fonts;
    pointValuesLimit:            number;
    autoLoginUsername:           string;
    autoLoginPassword:           string;
    userModule:                  string;
    userCss:                     string;
    eventAudioFiles:             EventAudioFiles;
    eventReadAloud:              Event;
    eventNotify:                 Event;
    timeouts:                    Timeouts;
    pwaManifest:                 PwaManifest;
    pwaUseThemeColors:           boolean;
    pwaAutomaticName:            string;
    pwaAutomaticNamePrefix:      string;
    dateFormats:                 { [key: string]: string };
    showUnacknowlegedEventsIcon: boolean;
}

export interface EventAudioFiles {
    NONE:        string;
    INFORMATION: string;
    IMPORTANT:   string;
    WARNING:     string;
    URGENT:      string;
    CRITICAL:    string;
    LIFE_SAFETY: string;
    DO_NOT_LOG:  string;
}

export interface Event {
    NONE:        boolean;
    INFORMATION: boolean;
    IMPORTANT:   boolean;
    WARNING:     boolean;
    URGENT:      boolean;
    CRITICAL:    boolean;
    LIFE_SAFETY: boolean;
    DO_NOT_LOG:  boolean;
}

export interface Fonts {
    default:   string;
    heading:   string;
    paragraph: string;
    code:      string;
}

export interface Palettes {
    "mango-orange":          { [key: string]: string };
    "mango-blue":            { [key: string]: string };
    "mango-blue-2020":       { [key: string]: string };
    "mango-orange-2020":     { [key: string]: string };
    "mango-background-2020": { [key: string]: string };
}

export interface PwaManifest {
    name:             string;
    start_url:        string;
    display:          string;
    theme_color:      string;
    background_color: string;
    icons:            Icon[];
}

export interface Icon {
    src:   string;
    sizes: string;
    type:  string;
}

export interface Themes {
    mangoLight:     Mango;
    mangoDark:      Mango;
    userTheme:      UserTheme;
    mangoDark2020:  Mango2020;
    mangoLight2020: Mango2020;
}

export interface Mango {
    primaryPalette:     string;
    primaryPaletteHues: PaletteHues;
    accentPalette:      string;
    accentPaletteHues:  PaletteHues;
    dark:               boolean;
}

export interface PaletteHues {
    default: string;
    "hue-1": string;
    "hue-2": string;
    "hue-3": string;
}

export interface Mango2020 {
    primaryPalette:        string;
    primaryPaletteHues:    PaletteHues;
    accentPalette:         string;
    accentPaletteHues:     PaletteHues;
    backgroundPalette:     string;
    backgroundPaletteHues: PaletteHues;
    dark:                  boolean;
}

export interface UserTheme {
    primaryPalette:    string;
    accentPalette:     string;
    warnPalette:       string;
    backgroundPalette: string;
    dark:              boolean;
}

export interface Timeouts {
    xhr:                 number;
    websocket:           number;
    websocketRequest:    number;
    pointValues:         number;
    watchdogStatusDelay: number;
    moduleUpload:        number;
}