import { NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { TabsModule } from "ngx-bootstrap/tabs";
import { firstValueFrom } from "rxjs";

// @sinequa/core library
import { WebServicesModule, StartConfigWebService, StartConfig } from "@sinequa/core/web-services";
import { LoginModule, LoginInterceptor } from "@sinequa/core/login";
import { IntlModule } from "@sinequa/core/intl";
import { ModalModule } from "@sinequa/core/modal";
import { NotificationsInterceptor } from "@sinequa/core/notification";
import { AuditInterceptor } from "@sinequa/core/app-utils";

// @sinequa/components library
import { BsSearchModule, SearchOptions } from "@sinequa/components/search";
import { BsAutocompleteModule } from "@sinequa/components/autocomplete";
import { BsNotificationModule } from "@sinequa/components/notification";
import { BsFacetModule } from "@sinequa/components/facet";
import { BsActionModule } from "@sinequa/components/action";
import { BsModalModule } from "@sinequa/components/modal";
import { BsBasketsModule } from '@sinequa/components/baskets';
import { BsAlertsModule } from '@sinequa/components/alerts';
import { BsSavedQueriesModule, RecentDocumentsService, RecentQueriesService } from '@sinequa/components/saved-queries';
import { UtilsModule, SCREEN_SIZE_RULES } from '@sinequa/components/utils';
import { BsLabelsModule } from '@sinequa/components/labels';
import { BsUserSettingsModule } from '@sinequa/components/user-settings';
import { ResultModule } from '@sinequa/components/result';
import { BsFeedbackModule } from '@sinequa/components/feedback';
import { PreviewModule } from '@sinequa/components/preview';
import { MetadataModule } from '@sinequa/components/metadata';
import { BsSelectionModule, SELECTION_OPTIONS } from '@sinequa/components/selection';
import { BsAdvancedModule } from '@sinequa/components/advanced';
import { FiltersModule } from "@sinequa/components/filters";

import { BsTimelineModule } from "@sinequa/analytics/timeline";
import { BsHeatmapModule } from "@sinequa/analytics/heatmap";
import { SlideBuilderModule } from '@sinequa/components/slide-builder';
import { CommentsModule } from "@sinequa/components/comments";
import { MLModule } from '@sinequa/components/machine-learning';
import { NetworkModule } from '@sinequa/analytics/network';

// Fusion Charts
import { FusionChartsModule } from '@sinequa/analytics/fusioncharts';
import * as FusionCharts from "fusioncharts";
import * as charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import * as CandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";
FusionCharts.options.creditLabel = false;

// Components
import { AppComponent } from "./app.component";
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { PreviewComponent } from './preview/preview.component';
import { AppSearchFormComponent } from './search-form/search-form.component';
import { AutocompleteComponent } from './search-form/autocomplete.component';
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { NetworkPipe } from "./search/network.pipe";
import { HomeConfiguratorComponent } from "./home/home-configurator.component";
import { SearchConfiguratorComponent } from "./search/search-configurator.component";

import { GlobalService } from "./configurators/app-configuration/global.service"

// Application languages (intl service)
import {LocalesConfig, Locale} from "@sinequa/core/intl";
import enLocale from "../locales/en";
import frLocale from "../locales/fr";
import deLocale from "../locales/de";

// Environment
import { environment } from "../environments/environment";

// UI Builder
import {
    icons,
    SvgIconsModule,
    uibModule
} from '@sinequa/ngx-ui-builder';
import { ConfiguratorsModule } from "./configurators/configurators.module";
import { AppConfigService } from "./app-config.service";

// standalone components
import { SearchFormComponent } from "@sinequa/components/search-form";


// Initialization of @sinequa/core
export const startConfig: StartConfig = {
    // app: "training",
    production: environment.production,
    // autoSAMLProvider: environment.autoSAMLProvider,
    auditEnabled: true
};

// @sinequa/core config initializer
export function StartConfigInitializer(startConfigWebService: StartConfigWebService): () => Promise<StartConfig> {
    const init = () => firstValueFrom(startConfigWebService.fetchPreLoginAppConfig());
    return init;
}


// Application routes (see https://angular.io/guide/router)
export const routes: Routes = [
    {path: "home", component: HomeComponent},
    {path: "search", component: SearchComponent},
    {path: "preview", component: PreviewComponent},
    {path: "**", redirectTo: "home"}
];


// Search options (search service)
export const searchOptions: SearchOptions = {
    routes: ["search"],
    homeRoute: "home"
};


// Application languages (locales)
export class AppLocalesConfig implements LocalesConfig {
    defaultLocale: Locale;
    locales?: Locale[];
    constructor(){
        this.locales = [
            { name: "en", display: "msg#locale.en", data: enLocale},
            { name: "fr", display: "msg#locale.fr", data: frLocale},
            { name: "de", display: "msg#locale.de", data: deLocale},
        ];
        this.defaultLocale = this.locales[0];
    }
}


// Screen size breakpoints (consistent with Bootstrap custom breakpoints in app.scss)
export const breakpoints = {
    xl: "(min-width: 1650px)",
    lg: "(min-width: 1400px) and (max-width: 1649.98px)",
    md: "(min-width: 992px) and (max-width: 1399.98px)",
    sm: "(min-width: 576px) and (max-width: 991.98px)",
    xs: "(max-width: 575.98px)",
};


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        TabsModule,

        WebServicesModule.forRoot(startConfig),
        IntlModule.forRoot(AppLocalesConfig),
        LoginModule,
        ModalModule,

        BsSearchModule.forRoot(searchOptions),
        BsAutocompleteModule,
        BsNotificationModule,
        BsFacetModule,
        BsActionModule,
        BsModalModule,
        BsBasketsModule,
        BsAlertsModule,
        BsSavedQueriesModule,
        UtilsModule,
        BsLabelsModule,
        BsUserSettingsModule,
        ResultModule,
        BsFeedbackModule,
        PreviewModule,
        MetadataModule,
        BsSelectionModule,
        BsAdvancedModule,
        BsTimelineModule,
        BsHeatmapModule,
        FusionChartsModule.forRoot(FusionCharts, charts, FusionTheme, CandyTheme),
        SlideBuilderModule,
        CommentsModule,
        MLModule,
        NetworkModule,

        // Standalone components
        FiltersModule,
        SearchFormComponent,

        // UI Builder
        SvgIconsModule.forRoot({icons: icons}),
        uibModule,

        ConfiguratorsModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        HomeConfiguratorComponent,
        SearchComponent,
        SearchConfiguratorComponent,
        PreviewComponent,
        AppSearchFormComponent,
        AutocompleteComponent,
        ToolbarComponent,
        NetworkPipe
    ],
    providers: [
        // Provides an APP_INITIALIZER which will fetch application configuration information from the Sinequa
        // server automatically at startup using the application name specified in the URL (app[-debug]/<app-name>).
        // This allows an application to avoid hard-coding parameters in the StartConfig but requires that the application
        // be served from the an app[-debug]/<app name> URL.
        {provide: APP_INITIALIZER, useFactory: StartConfigInitializer, deps: [StartConfigWebService], multi: true},

        // Provides the Angular LocationStrategy to be used for reading route state from the browser's URL. Currently
        // only the HashLocationStrategy is supported by Sinequa.
        {provide: LocationStrategy, useClass: HashLocationStrategy},

        // Provides an HttpInterceptor to handle user login. The LoginInterceptor handles HTTP 401 responses
        // to Sinequa web service requests and initiates the login process.
        {provide: HTTP_INTERCEPTORS, useClass: LoginInterceptor, multi: true},

        // Provides an HttpInterceptor that offers a centralized location through which all client-side
        // audit records pass. An application can replace AuditInterceptor with a subclass that overrides
        // the updateAuditRecord method to add custom audit information to the records.
        {provide: HTTP_INTERCEPTORS, useClass: AuditInterceptor, multi: true},

        // Provides an HttpInterceptor that automatically processes any notifications specified in the $notifications
        // member of the response body to any Sinequa web service requests.
        {provide: HTTP_INTERCEPTORS, useClass: NotificationsInterceptor, multi: true},

        {provide: SCREEN_SIZE_RULES, useValue: breakpoints},
        {provide: SELECTION_OPTIONS, useValue: {storage: 'record'}}
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {

    constructor(
        _globalService: GlobalService,
        _recentQueriesService: RecentQueriesService,
        _RecentDocumentsService: RecentDocumentsService,
        _appConfigService: AppConfigService) {
            // start listening global configuration changes
            _globalService.startListening();
        }
}
