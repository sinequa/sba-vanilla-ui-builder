import { Injectable } from "@angular/core";
import { NotificationsService } from "@sinequa/core/notification";
import { UserSettingsWebService } from "@sinequa/core/web-services";
import { ComponentConfig, ConfigService } from "ngx-ui-builder";
import { Subscription } from "rxjs";
import { debounceTime, skip, switchMap } from "rxjs/operators";
import { FACETS } from "../config";

@Injectable({providedIn: 'root'})
export class AppConfigService {

  sub?: Subscription;

  constructor(
    public userSettingsService: UserSettingsWebService,
    public configService: ConfigService,
    public notificationsService: NotificationsService
  ){
    this.userSettingsService.events.subscribe(_ => {
      let config: ComponentConfig[];
      if(this.userSettingsService.userSettings?.['ui-builder']) {
        config = this.userSettingsService.userSettings?.['ui-builder'];
      }
      else {
        config = this.getDefaultConfig();
      }
      this.configService.init(config);
      
      // Prevent double-subscribtion in case of login/logout
      if(!this.sub) {
        this.sub = this.configService.watchAllConfig().pipe(
          debounceTime(3000),
          skip(1), // Skip the first save corresponding to initialization
          switchMap(config => this.userSettingsService.patch({"ui-builder": config}))
        ).subscribe(_ => this.notificationsService.success("Saved"));
      }
    });

  }

  getDefaultConfig() {  
    const config = [] as ComponentConfig[];
    // Initialize list of facets
    config.push({
      id: 'facets',
      type: 'container',
      items: FACETS.map(f => f.name),
      classes: 'flex-column'
    });
    FACETS.forEach(f => config.push({
      ...f,
      id: f.name,
      type: `facet-${f.type}`,
    }));

    // Initialize result list
    config.push(...this.predefinedResultsViews[0].config);

    // Initialize toolbar
    config.push({
      id: 'results-header',
      type: 'container',
      items: ['tabs','toolbar','did-you-mean','sponsored-results'],
      classes: 'flex-column'
    },
    {
      id: 'toolbar',
      type: 'container',
      items: ['my-search','result-counter','sort-selector']
    },
    {
      id: 'my-search',
      type: 'my-search',
      classes: 'flex-grow-1',
      allowDeletion: true
    },
    {
      id: 'sort-selector',
      type: 'sort-selector',
      rightAligned: true
    });

    // Initialize navbar
    config.push({
      id: 'navbar',
      type: 'container',
      items: ['logo','search-form','baskets-menu','saved-queries-menu','labels-menu','alerts-menu','user-menu','feedback-menu'],
      classes: 'flex-grow-1 align-items-center'
    },
    {
      id: 'search-form',
      type: 'search-form',
      classes: 'flex-grow-1 flex-basis-0 mx-3',
      autocompleteSources: ['suggests','baskets','recent-documents','recent-queries','saved-queries'],
      enableVoiceRecognition: true,
      keepTab: true,
      enableKeepFilters: true,
      keepFilters: true,
      enableAdvancedForm: true,
      keepAdvancedSearchFilters: true
    },
    {
      id: 'baskets-menu',
      type: 'baskets-menu',
      classes: 'navbar-nav navbar-right'
    },
    {
      id: 'saved-queries-menu',
      type: 'saved-queries-menu',
      classes: 'navbar-nav navbar-right'
    },
    {
      id: 'labels-menu',
      type: 'labels-menu',
      classes: 'navbar-nav navbar-right'
    },
    {
      id: 'alerts-menu',
      type: 'alerts-menu',
      classes: 'navbar-nav navbar-right'
    },
    {
      id: 'user-menu',
      type: 'user-menu',
      classes: 'navbar-nav navbar-right'
    });

    return config;
  }

  predefinedResultsViews = [
    {
      name: 'List',
      icon: 'fas fa-list',
      config: [{
        id: 'results',
        type: 'container',
        items: ['result-left-side', 'result-thumbnail'],
        classes: 'record list-view'
      },
      {
        id: 'result-left-side',
        type: 'container',
        items: ['result-title-container', 'result-source', 'result-extracts', 'result-metas', 'result-missing-terms'],
        classes: 'flex-grow-1 overflow-hidden flex-column' // Overflow hidden is important for truncating long URLs
      },
      {
        id: 'result-title-container',
        type: 'container',
        items: ['result-selector', 'result-title'],
        classes: 'align-items-center'
      },
      {
        id: 'result-title',
        type: 'result-title',
        classes: 'overflow-hidden'
      },
      {
        id: 'result-metas',
        type: 'container',
        items: ['result-person', 'result-labels-public', 'result-labels-private']
      },
      {
        id: 'result-labels-public',
        type: 'result-labels',
        public: true
      },
      {
        id: 'result-labels-private',
        type: 'result-labels',
        public: false
      },
      {
        id: 'result-source',
        type: 'result-source',
        displayTreepath: true,
        displayUrl: true
      },
      {
        id: 'result-thumbnail',
        type: 'result-thumbnail',
        classes: 'align-self-center ms-3',
        thumbnailColumn: 'sourcevarchar4',
        linkBehavior: 'action'
      },
      {
        id: 'result-person',
        type: 'result-metadata',
        item: 'person',
        clickable: true
      }]
    },
    {
      name: 'Tiles',
      icon: 'fas fa-th-large',
      config: [{
        id: 'results',
        type: 'container',
        items: ['result-title-container', 'result-source', 'result-thumbnail', 'result-missing-terms'],
        classes: 'record tile-view flex-column align-items-stretch overflow-hidden'
      },
      {
        id: 'result-title-container',
        type: 'container',
        items: ['result-selector', 'result-title'],
        classes: 'align-items-center justify-content-center'
      },
      {
        id: 'result-source',
        type: 'result-source',
        displayTreepath: true,
        displayUrl: true
      },
      {
        id: 'result-thumbnail',
        type: 'result-thumbnail',
        classes: 'mt-2',
        thumbnailColumn: 'sourcevarchar4',
        linkBehavior: 'action'
      }]
    }
  ];

}