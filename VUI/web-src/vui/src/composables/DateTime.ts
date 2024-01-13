const configureTimezone = (timezone = getTimezone()) => {
    if (timezone !== this.timezone) {
        const prevTimezone = this.timezone;
        this.timezone = timezone;

        moment.tz.setDefault(timezone);

        maEventBus.publish('maUser/timezoneChanged', timezone, prevTimezone);
    }
};
getSystemLocale() {
    return systemLocale || MA_DEFAULT_LOCALE || (window.navigator.languages && window.navigator.languages[0]) || window.navigator.language;
    },

    getTimezone() {
    if (currentUser) {
       return currentUser.getTimezone();
    }
    return this.getSystemTimezone();
    },

    const getSystemTimezone =() => {
    return systemTimezone || MA_DEFAULT_TIMEZONE || DateTime.now().zone;
    },

