<script setup lang="ts">
import Card from 'primevue/card';
import MdIcon from '@/composables/MdIcon.vue';
import diskspaceSvg from '@/assets/svgs/diskspace-icon.svg';
import cpuLoadSvg from '@/assets/svgs/cpuload-icon.svg';
import sqlSvg from '@/assets/svgs/sql-icon.svg';
import noSqlSvg from '@/assets/svgs/nosql-icon.svg';
import ramSvg from '@/assets/svgs/ram-icon.svg';
</script>

<template>
    

        <div class="flex-1 align-items-center justify-content-center gap-3">
            <Card class="ma-rounded-border">
                <template #title>
                    <span layout layout-align="center center">
                        <i class="fa fa-server" aria-hidden="true"></i>
                        <span class="ma-card-title" v-tr='"vui.adminHome.serverStatus"' v-tr:args="[3]">vui.adminHome.serverStatus</span>
                    </span>
                    <Button ma-tr="vui.app.moreDetails" ui-sref="vui.settings.systemStatus"></Button>
                </template>
                <template #content>
                    <div class="flex flex-row ma-server-status-contents">
                        <!-- layout-xs="column" layout-sm="row" layout="column" layout-align="space-between stretch"
                layout-align-gt-sm="start start"  -->
                        <div class="flex flex-column ma-server-details">
                            <div class="flex">
                                <!-- v-bind="maUiServerInfo.serverTimezone" -->maUiServerInfo.serverTimezone
                            </div>
                            <div class="flex ma-ui-home-page-sub-text" ma-tr="users.timezone">users.timezone</div>
                            <div class="flex">
                                <!-- <ma-get-point-value point-xid="internal_mango_uptime_hrs" point="uptimePoint"></ma-get-point-value> -->
                                <!-- <div v-bind="(uptimePoint.value * 3600000) | maDuration:'humanize'"></div> -->
                                <div class="ma-ui-home-page-sub-text" ma-tr="vui.adminHome.uptime">vui.adminHome.uptime
                                </div>
                            </div>
                            <div class="flex">
                                <div>
                                    maUiServerInfo.coreLicenseType  <!-- v-bind="maUiServerInfo.coreLicenseType" -->
                                </div>
                                <div class="ma-ui-home-page-sub-text" ma-tr="modules.licenseType"></div>
                            </div>
                        </div>
                        <!-- </template>
            <template #content layout-xs="column" layout="row" layout-align="space-between stretch"
                layout-align-gt-sm="space-between center" flex v-class="{'ma-server-details': $mdMedia('xs')}"> -->
                        <div class="flex flex-column">
                            <div class="flex"> <img :src=sqlSvg /> </div>
                            <div class="flex ma-text-centered">
                                <ma-point-value point-xid="internal_mango_sql_db_size"></ma-point-value>
                                <span class="ma-ui-home-page-label" ma-tr="vui.adminHome.diskSpace.used">vui.adminHome.diskSpace.used</span>
                            </div>
                            <div class="flex ma-text-centered">
                                <ma-point-value point-xid="internal_mango_sql_db_usable_space"></ma-point-value>
                                <span class="flex ma-ui-home-page-label" ma-tr="vui.adminHome.diskSpace.available">vui.adminHome.diskSpace.available</span>
                            </div>
                            <div class="flex ma-ui-home-page-sub-text" ma-tr="systemInfo.databaseSizeDesc">systemInfo.databaseSizeDesc</div>
                        </div>
                        <div layout="column" layout-align="center center" layout-align-xs="center start">
                            <div>
                                <img :src=noSqlSvg />
                            </div>
                            <div class="ma-text-centered">
                                <ma-point-value point-xid="internal_mango_no_sql_db_size"></ma-point-value>
                                <span class="ma-ui-home-page-label" ma-tr="vui.adminHome.diskSpace.used">vui.adminHome.diskSpace.used</span>
                            </div>
                            <div class="ma-text-centered">
                                <ma-point-value point-xid="internal_mango_no_sql_db_usable_space"></ma-point-value>
                                <span class="ma-ui-home-page-label" ma-tr="vui.adminHome.diskSpace.available">vui.adminHome.diskSpace.available</span>
                            </div>
                            <div class="ma-ui-home-page-sub-text" ma-tr="systemSettings.noSqlDatabaseSize">systemSettings.noSqlDatabaseSize</div>
                        </div>
                        <div layout="column" layout-align="center center" layout-align-xs="center start">
                            <div><img :src=diskspaceSvg /></div>
                            <div class="ma-text-centered">
                                <ma-point-value point-xid="internal_mango_disk_used_space"></ma-point-value>
                                <span class="ma-ui-home-page-label" ma-tr="vui.adminHome.diskSpace.used">vui.adminHome.diskSpace.used</span>
                            </div>
                            <div class="ma-text-centered">
                                <ma-point-value point-xid="internal_mango_disk_usable_space"></ma-point-value>
                                <span class="ma-ui-home-page-label" ma-tr="vui.adminHome.diskSpace.available">vui.adminHome.diskSpace.available</span>
                            </div>
                            <div class="ma-ui-home-page-sub-text" ma-tr="vui.adminHome.diskSpace">vui.adminHome.diskSpace</div>
                        </div>
                        <!-- </template>
            <template #content > -->
                        <!-- layout-xs="column" layout="row" layout-align="space-between stretch"
                layout-align-gt-sm="space-between center" flex flex-md="100" v-class="{'ma-server-details': $mdMedia('xs'), 'ma-server-details-graph': $mdMedia('gt-xs')}" -->
                        <div layout="column" layout-align="center center" layout-align-xs="center start">
                            <div>
                                <img :src="ramSvg" />
                            </div>
                            <div class="ma-text-centered">
                                <ma-point-value point-xid="internal_jvm_used_memory"></ma-point-value>
                                <span class="ma-ui-home-page-label" ma-tr="vui.adminHome.memory.used">vui.adminHome.memory.used</span>
                            </div>
                            <div class="ma-text-centered">
                                <ma-point-value point-xid="internal_jvm_free_memory"></ma-point-value>
                                <span class="ma-ui-home-page-label" ma-tr="vui.adminHome.memory.available">vui.adminHome.memory.available</span>
                            </div>
                            <div class="ma-ui-home-page-sub-text" ma-tr="vui.adminHome.memory">vui.adminHome.memory</div>
                        </div>
                        <div layout="column" layout-align="center center" layout-align-xs="center start">
                            <div><img :src="cpuLoadSvg" /></div>
                            <div class="ma-text-centered">
                                <ma-point-value point-xid="internal_cpu_process_load"></ma-point-value>
                                <span class="ma-ui-home-page-label" ma-tr="vui.adminHome.cpuLoad.process">vui.adminHome.cpuLoad.process</span>
                            </div>
                            <div class="ma-text-centered">
                                <ma-point-value point-xid="internal_cpu_system_load"></ma-point-value>
                                <span class="ma-ui-home-page-label" ma-tr="vui.adminHome.cpuLoad.system">vui.adminHome.cpuLoad.system</span>
                            </div>
                            <div class="ma-ui-home-page-sub-text" ma-tr="vui.adminHome.cpuLoad">vui.adminHome.cpuLoad</div>
                        </div>
                        <div class="ma-ui-home-page-graph">
                            <!-- <ma-get-point-value point-xid="internal_cpu_system_load" point="cpuLoad"></ma-get-point-value>
                    <ma-get-point-value point-xid="internal_jvm_used_memory" point="usedRam"></ma-get-point-value>
                    <ma-point-values points="[cpuLoad, usedRam]" values="sparkChartValues" from="maUiDateBar.from"
                        to="maUiDateBar.to" rollup="{{maUiDateBar.rollupType}}" rendered="::true"
                        rollup-interval="{{maUiDateBar.rollupIntervals}} {{maUiDateBar.rollupIntervalPeriod}}">
                    </ma-point-values>
                    <ma-serial-chart class="ma-sparkline-chart" points="[cpuLoad, usedRam]"
                        values="sparkChartValues" balloon="::true" point-title="$point.name"
                        series-1-color="#6effa3" series-2-color="#49abd0" series-2-axis="right"
                        options="{autoMargins: false, categoryAxis:{labelsEnabled:false, gridAlpha: 0, axisAlpha: 0}}">
                    </ma-serial-chart> -->
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <!-- missing -->
        <!-- <Card class="ma-info-card ma-hover" flex v-if="maUser.current.hasRole('superadmin')"> -->
        <div class="flex flex-row gap-3">
            <div class="flex gap-3">

                <Card class="flex ma-info-card ma-hover">
                    <Button class="ma-info-card-button" md-no-ink ui-sref="vui.settings.dataSources">
                        <div class="ma-button-icon">
                            <MdIcon>device_hub</MdIcon>
                        </div>
                        <div class="ma-content">
                            <!-- <ma-point-value class="ma-button-value"
                                point-xid="internal_mango_num_data_sources"></ma-point-value> -->
                            <div class="ma-value-label" ma-tr="vui.app.dataSources">vui.app.dataSources</div>
                        </div>
                        <div class="ma-add">
                            <MdIcon>add_circle_outline</MdIcon>
                        </div>
                        <div class="ma-watermark">
                            <MdIcon>device_hub</MdIcon>
                        </div>
                    </Button>
                </Card>
            </div>
            <div class="flex gap-3">
                <Card class="flex gap-3 ma-info-card ma-hover">
                    <Button class="ma-info-card-button" md-no-ink ui-sref="vui.dataPointDetails">
                        <div class="ma-button-icon">
                            <MdIcon>timeline</MdIcon>
                        </div>
                        <div class="ma-content">
                            <!-- <ma-point-value class="ma-button-value" point-xid="internal_mango_num_data_points"></ma-point-value> -->
                            <div class="ma-value-label" ma-tr="vui.app.dataPoints">vui.app.dataPoints</div>
                        </div>
                        <div class="ma-add">
                            <MdIcon>add_circle_outline</MdIcon>
                        </div>
                        <div class="ma-watermark">
                            <MdIcon>timeline</MdIcon>
                        </div>
                    </Button>
                </Card>
            </div>
            <div class="flex gap-3">
                <Card class="flex  ma-info-card ma-hover">
                    <Button class="ma-info-card-button" md-no-ink ui-sref="vui.watchList">
                        <div class="ma-button-icon">
                            <MdIcon>remove_red_eye</MdIcon>
                        </div>
                        <div class="ma-content">
                            <ma-point-value class="ma-button-value"
                                point-xid="internal_mango_num_watchlists"></ma-point-value>
                            <div class="ma-value-label" ma-tr="vui.app.watchLists">vui.app.watchLists</div>
                        </div>
                        <div class="ma-add">
                            <MdIcon>add_circle_outline</MdIcon>
                        </div>
                        <div class="ma-watermark">
                            <MdIcon>remove_red_eye</MdIcon>
                        </div>
                    </Button>
                </Card>
            </div>
            <!-- <Card class="ma-info-card ma-hover" flex v-if="maUser.current.hasRole('superadmin')"> -->
            <div class="flex gap-3">
                <Card class="flex ma-info-card ma-hover">
                    <Button class="ma-info-card-button" md-no-ink ui-sref="vui.settings.publishers">
                        <div class="ma-button-icon">
                            <MdIcon style="{color:black}">publish</MdIcon>
                        </div>
                        <div class="ma-content">
                            <ma-point-value class="ma-button-value"
                                point-xid="internal_mango_num_publishers"></ma-point-value>
                            <div class="ma-value-label" ma-tr="vui.app.publishers">vui.app.publishers</div>
                        </div>
                        <div class="ma-add">
                            <MdIcon>add_circle_outline</MdIcon>
                        </div>
                        <div class="ma-watermark">
                            <MdIcon>publish</MdIcon>
                        </div>
                    </Button>
                </Card>
            </div>
        </div>
        <div class="flex flex-row gap-3">
            <!-- <Card class="ma-detailed-info-card" flex v-if="maUser.current.hasRole('superadmin')"> -->
            <Card class="flex ma-detailed-info-card">
                <div class="ma-watermark ma-watermark-big">
                    <MdIcon>settings</MdIcon>
                </div>
                <template #title>
                    <!-- layout layout-align="space-between center" -->
                    <span layout layout-align="center center">
                        <MdIcon>settings</MdIcon>
                        <span ma-tr="vui.app.system"></span>
                    </span>
                </template>
                <template #content> <!-- layout="column" layout-align="center stretch" -->
                    <div flex layout="column" layout-align="space-between stretch">
                        <Button md-no-ink class="ma-info-card-button ma-hover" ui-sref="vui.settings.modules">
                            <div class="ma-content">
                                <ma-point-value class="ma-button-value"
                                    point-xid="internal_mango_num_updates_available"></ma-point-value>
                                <div class="ma-value-label" ma-tr="vui.app.modules"></div>
                            </div>
                        </Button>
                        <Button md-no-ink class="ma-info-card-button ma-hover"
                            ui-sref="{{::hasDashboardDesigner ? 'vui.settings.dashboardDesigner' : 'vui.settings.editPages'}}">
                            <div class="ma-content">
                                <!-- <div class="ma-button-value" v-bind="pageCount"></div> -->
                                <div class="ma-value-label" ma-tr="vui.app.customPages"></div>
                            </div>
                        </Button>
                        <Button class="ma-redirect md-raised md-primary" ui-sref="vui.settings.system" layout="row">
                            <div ma-tr="vui.app.systemSettings" flex></div>
                            <MdIcon>subdirectory_arrow_right</MdIcon>
                        </Button>
                        <Button class="ma-redirect md-raised md-primary" ui-sref="vui.settings.importExport" layout="row">
                            <div ma-tr="header.emport" flex></div>
                            <MdIcon>subdirectory_arrow_right</MdIcon>
                        </Button>
                    </div>
                </template>
                <!-- <div class="ma-watermark ma-big">
                            <MdIcon>settings</MdIcon>
                        </div> -->
            </Card>

            <!-- Missing roles and permisions link -->
            <Card class="flex ma-detailed-info-card">
                <template #title>
                    <!-- flex v-if="maUser.current.hasRole('superadmin')"> -->
                    <!-- <div class="ma-watermark ma-watermark-big">
                        <MdIcon>people</MdIcon>
                    </div> -->
                    <!-- layout layout-align="space-between center"-->
                    <span layout layout-align="center center">
                        <MdIcon>people</MdIcon>
                        <span ma-tr="vui.app.users"></span>
                    </span>
                    <Button ma-tr="vui.app.viewAll" ui-sref="vui.settings.users"></Button>
                </template>
                <template #content> <!-- layout="column" layout-align="center stretch" -->
                    <div flex layout="column" layout-align="space-between stretch">
                        <Button md-no-ink class="ma-info-card-button ma-hover" ui-sref="vui.settings.users">
                            <div class="ma-content">
                                <ma-point-value class="ma-button-value"
                                    point-xid="internal_mango_num_users"></ma-point-value>
                                <div class="ma-value-label" ma-tr="vui.app.users"></div>
                            </div>
                        </Button>
                        <Button md-no-ink class="ma-info-card-button ma-hover">
                            <div class="ma-content">
                                <ma-point-value class="ma-button-value"
                                    point-xid="internal_mango_num_active_user_sessions"></ma-point-value>
                                <div class="ma-value-label" ma-tr="vui.app.activeSessions"></div>
                            </div>
                        </Button>
                        <Button class="ma-redirect md-raised md-primary" layout="row" ui-sref="vui.settings.permissions">
                            <div ma-tr="header.systemPermissions" flex></div>
                            <MdIcon>subdirectory_arrow_right</MdIcon>
                        </Button>
                        <Button class="ma-redirect md-raised md-primary" layout="row"
                            ui-sref="vui.settings.autoLoginSettings">
                            <div ma-tr="vui.app.autoLoginSettings" flex></div>
                            <MdIcon>subdirectory_arrow_right</MdIcon>
                        </Button>
                    </div>
                </template>
            </Card>

            <!-- missing section 1 & 2 data point & missing section 3 full .p-card-->
            <Card class="flex ma-detailed-info-card">
                <!-- flex v-if="maUser.current.hasRole('superadmin')"> -->
                <div class="ma-watermark ma-watermark-big">
                    <MdIcon>alarm</MdIcon>
                </div>
                <template #title>
                    <!-- layout layout-align="space-between center" -->
                    <span layout layout-align="center center">
                        <MdIcon>alarm</MdIcon>
                        <span ma-tr="vui.app.events"></span>
                    </span>
                    <Button ma-tr="vui.app.viewAll" ui-sref="vui.events"></Button>
                </template>
                <template #content> <!-- layout="column" layout-align="center stretch" -->
                    <div flex layout="column" layout-align="space-between stretch">
                        <Button md-no-ink class="ma-info-card-button ma-hover"
                            ui-sref="vui.events({eventType: 'DATA_POINT'})">
                            <div class="ma-content">
                                <!-- <div class="ma-button-value" v-bind="eventCounts.dataPoint"></div> -->
                                <div class="ma-value-label" ma-tr="vui.app.dataPointEvents"></div>
                            </div>
                        </Button>
                        <Button md-no-ink class="ma-info-card-button ma-hover" ui-sref="vui.events({eventType: 'SYSTEM'})">
                            <div class="ma-content">
                                <!-- <div class="ma-button-value" v-bind="eventCounts.system"></div> -->
                                <div class="ma-value-label" ma-tr="vui.app.systemEvents"></div>
                            </div>
                        </Button>
                        <Button class="ma-redirect md-raised md-primary" layout="row">
                            <ma-point-value point-xid="internal_mango_num_event_detectors"></ma-point-value>
                            <div ma-tr="vui.app.eventDetectors"></div>
                        </Button>
                        <Button class="ma-redirect md-raised md-primary" layout="row" ui-sref="vui.settings.eventHandlers">
                            <ma-point-value point-xid="internal_mango_num_event_handlers"></ma-point-value>
                            <div ma-tr="vui.app.eventHandlers" flex></div>
                            <MdIcon>subdirectory_arrow_right</MdIcon>
                        </Button>
                    </div>
                </template>
            </Card>

            <!-- missing section 1, test section 2 -->
            <!-- <Card class="ma-detailed-info-card" flex v-if="maUser.current.hasRole('superadmin')"> -->
            <Card class="flex ma-detailed-info-card">
                <template #title>
                    <!-- <div class="ma-watermark ma-watermark-big">
                        <MdIcon>book</MdIcon>
                    </div> -->
                    <!-- layout layout-align="space-between center" -->
                    <span layout layout-align="center center">
                        <MdIcon>book</MdIcon>
                        <span ma-tr="vui.app.reports">vui.app.reports</span>
                    </span>
                    <Button ma-tr="vui.app.viewAll" ui-sref="vui.settings.excelReports"></Button>
                </template>
                <template #content>
                    <div flex layout="column" layout-align="space-between stretch">
                        <Button md-no-ink class="ma-info-card-button ma-hover">
                            <div class="ma-content">
                                <ma-point-value class="ma-button-value"
                                    point-xid="internal_mango_num_mailing_lists"></ma-point-value>
                                <div class="ma-value-label" ma-tr="vui.app.mailingLists"></div>
                            </div>
                        </Button>
                        <Button md-no-ink class="ma-info-card-button ma-hover" ui-sref="vui.settings.excelReports">
                            <div class="ma-content">
                                <ma-get-point-value point-xid="internal_mango_num_excel_report_templates"
                                    point="excelReportTemplates"></ma-get-point-value>
                                <!-- <div class="ma-button-value" v-bind="excelReportTemplates.value ?  excelReportTemplates.value : 0"></div> -->
                                <div class="ma-value-label" ma-tr="vui.app.excelReports"></div>
                            </div>
                        </Button>
                    </div>
                </template>
            </Card>
        </div>
        <div class="flex-1 flex-row  gap-3">
            <!-- <Card v-if="utilityMenuItems.length" class="ma-rounded-border"> -->
            <Card class="flex ma-rounded-border">
                <template #title>
                    <!-- layout layout-align="space-between center" -->
                    <span layout layout-align="center center">
                        <i class="fa fa-cogs" aria-hidden="true"></i>
                        <span ma-tr="vui.app.utilities">vui.app.utilities</span>
                    </span>
                </template>
                <template #content>
                    <!-- layout layout-wrap -->
                    <!-- flex="100" flex-gt-xs="50" flex-gt-md="33" flex-gt-lg="20"
                v-for="item in utilityMenuItems track by item.name"
                v-if="maUser.current.hasPermission(item.permission)" -->
                    <div>
                        <Button class="md-raised md-primary ma-redirect" layout="row" ui-sref="{{item.name}}">
                            <div ma-tr="{{item.menuTr}}" flex></div>
                            <!-- <MdIcon>{{item.menuIcon}}</MdIcon> -->
                        </Button>
                    </div>
                </template>
            </Card>

</div></template>

<style scoped>
ma-ui-admin-home-page .p-card.ma-rounded-border,
ma-ui-admin-home-page .p-card.ma-info-card,
ma-ui-admin-home-page .p-card.ma-detailed-info-card {
    border-radius: 6px;
    overflow: hidden;
}

ma-ui-admin-home-page .p-card-header {
    background-color: var(--ma-background-hue-3);
    color: var(--ma-background-hue-3-contrast);
    padding: 4px 8px;
    font-size: 1.8rem;
}

ma-ui-admin-home-page .p-card-header i.fa,
ma-ui-admin-home-page .p-card-header i.material-icons {
    margin: 10px;
    font-size: 2.6rem;
    color: currentColor;
}

ma-ui-admin-home-page .p-card-header > .p-button {
    border-radius: 16px;
    border: solid 2px currentColor;
    text-transform: lowercase;
    min-height: 32px;
    line-height: 32px;
    margin: 4px 8px;
}

ma-ui-admin-home-page .p-card-header > .p-button:hover {
    border: solid 2px;
    border-color: var(--ma-accent) !important;
    color: var(--ma-accent) !important;
    text-transform: lowercase;
    min-height: 32px;
    line-height: 32px;
    margin: 4px 8px;
}

ma-ui-admin-home-page .ma-detailed-info-card > div > :nth-child(2n),
ma-ui-admin-home-page .ma-server-status-contents > :nth-child(2n) {
    background-color: var(--ma-background-hue-2);
    color: var(--ma-background-hue-2-contrast);
}

ma-ui-admin-home-page .ma-ui-home-page-label {
    color: var(--ma-foreground-3);
    font-size: 1.4rem;
    text-transform: lowercase;
}

ma-ui-admin-home-page .ma-ui-home-page-sub-text {
    color: var(--ma-foreground-3);
    font-weight: bold;
}

ma-ui-admin-home-page .ma-server-status-contents svg {
    width: 64px;
    height: 64px;
    margin-bottom: 12px;
}

ma-ui-admin-home-page .ma-server-details > div:not(:last-child) {
    margin-bottom: 12px;
}

ma-ui-admin-home-page .ma-server-details-graph > div:not(:last-child) {
    margin-right: 12px;
}

ma-ui-admin-home-page .ma-sparkline-chart {
    height: 170px;
    width: 150px;
    margin: -20px -10px;
}

ma-ui-admin-home-page .ma-hover {
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
}

ma-ui-admin-home-page .ma-hover:hover,
ma-ui-admin-home-page .ma-info-card.ma-hover:hover,
ma-ui-admin-home-page .ma-detailed-info-card .ma-hover:hover {
    border-color: var(--ma-accent);
    color: var(--ma-accent);
}

ma-ui-admin-home-page .ma-hover:hover .ma-value-label,
ma-ui-admin-home-page .ma-hover:hover div:not(.ma-watermark) i {
    color: var(--ma-accent);
}

ma-ui-admin-home-page .ma-value-label {
    color: var(--ma-foreground-3);
}

ma-ui-admin-home-page .p-button.ma-info-card-button {
    text-transform: unset;
    text-align: unset;
    font-size: unset;
    line-height: unset;
    margin: 0;
    padding: 16px;
    display: flex;
}

ma-ui-admin-home-page .ma-info-card .ma-info-card-button .ma-button-value {
    font-size: 24px;
}

ma-ui-admin-home-page .ma-info-card-button .ma-button-icon > i {
    font-size: 48px;
    margin-right: 16px;
}

ma-ui-admin-home-page .ma-info-card-button .ma-content {
    display: flex;
    flex-direction: column;
}

ma-ui-admin-home-page .ma-info-card-button .ma-add {
    position: absolute;
    top: 16px;
    right: 16px;
}

ma-ui-admin-home-page .ma-info-card .ma-info-card-button .ma-add > i {
    font-size: 36px;
}

ma-ui-admin-home-page .ma-watermark {
    position: absolute;
    bottom: 0px;
    right: 0px;
    margin-right: -26px;
    margin-bottom: -26px;
}

ma-ui-admin-home-page .ma-watermark > i.material-icons {
    font-size: 96px;
    color: rgba(var(--ma-background-400-value), 0.1);
}

ma-ui-admin-home-page .ma-detailed-info-card {
    position: relative;
}

ma-ui-admin-home-page .ma-watermark.ma-watermark-big {
    margin-right: -60px;
    margin-bottom: -60px;
}

ma-ui-admin-home-page .ma-watermark.ma-watermark-big > i.material-icons {
    font-size: 192px;
}

ma-ui-admin-home-page .p-button.ma-redirect {
    border-radius: 5px;
    text-transform: unset;
    text-align: unset;
    font-size: unset;
}

ma-ui-admin-home-page .p-button.ma-redirect > ma-point-value {
    margin-right: 8px;
}

ma-ui-admin-home-page .ma-redirect i.material-icons {
    color: inherit;
}

ma-ui-admin-home-page .ma-redirect > div > ma-point-value {
    margin: 0px 8px;
}
ma-ui-admin-home-page .ma-redirect.ma-hover:hover {
    border: 2px solid !important;
    border-color: var(--ma-accent) !important;
    cursor: pointer;
}

</style>
