import { Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { ComponentWithLogin } from "@sinequa/core/login";
import { BasketsService } from '@sinequa/components/baskets';
import { SavedQueriesService } from '@sinequa/components/saved-queries';
import { AlertsService } from '@sinequa/components/alerts';
import { LabelsService } from '@sinequa/components/labels';
import { UserPreferences } from '@sinequa/components/user-settings';
import { SelectionService } from '@sinequa/components/selection';
import { AppService } from '@sinequa/core/app-utils';
import { AuditWebService } from "@sinequa/core/web-services";
import { ConfigurableService } from "@sinequa/ngx-ui-builder";

@Component({
    selector: "app",
    templateUrl: "./app.component.html",
    host: {
      '(show.bs.dropdown)': '$event.preventDefault()'
    }
})
export class AppComponent extends ComponentWithLogin {


    constructor(
        // Services are instantiated by the app component,
        // to guarantee they are instantiated in a consistent order,
        // regardless of the entry route.
        // The order below impacts the order of the actions in the selection menu.
        prefs: UserPreferences,
        public savedQueriesService: SavedQueriesService,
        public basketsService: BasketsService,
        public alertsService: AlertsService,
        public labelsService: LabelsService,
        public selectionService: SelectionService,
        public appService: AppService,
        public configurableService: ConfigurableService,

        public router: Router,
        public auditWebService: AuditWebService
    ){
        super();

    }

    initDone: boolean = false;
    /**
     * Initialize the list of actions in the selection service.
     * This method may be called multiple times, before the login is actually complete,
     * hence the initDone and this.appService.app test
     */
    onLoginComplete(){

        if(!this.initDone && this.appService.app){

            this.initDone = true;

            this.selectionService.selectionActions.push(this.savedQueriesService.selectedRecordsAction);
            this.basketsService.selectedRecordsAction.icon = "fas fa-inbox"; // Overriding the baskets icon (hard coded in the service)
            this.selectionService.selectionActions.push(this.basketsService.selectedRecordsAction);
            const action = this.labelsService.buildSelectionAction();
            if(action){
                this.selectionService.selectionActions.push(action);
            }

            this.auditRouteChange();

            this.router.events.subscribe(event => {
                if(event instanceof NavigationEnd && this.loginService.complete) { // Check login complete in case of logout
                    this.auditRouteChange();
                }
            });

            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    this.auditWebService.notify({
                        type: `Navigation.exit`
                    });
                }
                if (document.visibilityState === 'visible') {
                    this.auditWebService.notify({
                        type: `Navigation.return`
                    });
                }
            });

            // On configurable change on the configurator
            this.configurableService.watchEdited()
                .subscribe(() => {
                    this.appService.refresh();
                });

        }
    }

    previousRoute: string | undefined;

    auditRouteChange() {
        const route = this.router.url.substr(1).split('?')[0]; // Extract route name
        if(route && route !== this.previousRoute) {
            this.auditWebService.notify({
                type: `Navigation.${route}`
            });
        }
        this.previousRoute = route;
    }

}
