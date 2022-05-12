import { Injectable } from '@angular/core';
import { UserSettingsWebService } from '@sinequa/core/web-services';
import { ComponentConfig, ConfigService, ToastService } from '@sinequa/ngx-ui-builder';
import { Subscription } from 'rxjs';
import { debounceTime, skip, switchMap } from 'rxjs/operators';
import { FACETS } from '../config';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  sub?: Subscription;

  constructor(
    public userSettingsService: UserSettingsWebService,
    public configService: ConfigService,
    public toastService: ToastService
  ) {

    // using userSettingsService.events observable don't works when we land in the home page first
    this.userSettingsService.events
      .subscribe(_ => {
        if (!this.sub) {
          this.setInitalConfiguration();
          this.configServiceSubscription();
        }
      });
  }

  reset() {
    this.configService.set(this.getDefaultConfig());
  }

  private setInitalConfiguration() {
    let config: ComponentConfig[];
    if(this.userSettingsService.userSettings?.['ui-builder']?.find(c => c.type === '_container')) {
      config = this.userSettingsService.userSettings?.['ui-builder'];
    }
    else {
      config = this.getDefaultConfig();
    }
    this.configService.init(config);
  }

  private configServiceSubscription() {
    this.sub = this.configService
      .watchAllConfig()
      .pipe(
        debounceTime(3000),
        skip(1), // Skip the first save corresponding to initialization
        switchMap((config) => this.userSettingsService.patch({ 'ui-builder': config }))
      )
      .subscribe(value => {
        this.toastService.info('UI configuration saved.');
      });
  }

  getDefaultConfig() {
    const config = [] as ComponentConfig[];
    // Initialize list of facets
    config.push({
      id: 'facets',
      type: '_container',
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
      type: '_container',
      items: ['tabs','toolbar','did-you-mean','sponsored-results'],
      classes: 'flex-column'
    },
    {
      id: 'toolbar',
      type: '_container',
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
      type: '_container',
      items: ['logo','search-form','baskets-menu','saved-queries-menu','labels-menu','alerts-menu','user-menu','feedback-menu'],
      classes: 'flex-grow-1 align-items-center'
    },
    {
      id: "logo",
      type: "logo",
      logoLightLg: "assets/sinequa-logo-light-lg.png",
      logoLightSm: "assets/sinequa-logo-light-sm.png",
      logoDarkLg: "assets/sinequa-logo-dark-lg.png",
      logoDarkSm: "assets/sinequa-logo-dark-sm.png",
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

    config.push({
      id: 'home',
      type: '_container',
      classes: 'flex-column align-items-center',
      items: ['home-logo', 'home-title', 'search-form-wrapper', 'home-actions', 'home-facets']
    },
    {
      id: 'home-logo',
      type: 'home-logo',
      logoLight: 'assets/vanilla-logo.png',
      logoDark: 'assets/vanilla-logo-dark.png'
    },
    {
      id: 'home-title',
      type: '_raw-html',
      rawHtml: "<h1>Vanilla Builder</h1>"
    },
    {
      id: 'search-form-wrapper',
      type: '_container',
      classes: 'my-2',
      items: ['search-form']
    },
    {
      id: 'home-facets',
      type: '_container',
      classes: 'flex-row sq-home-facet-bar container row justify-content-center mt-5',
      items: ['recent-documents', 'recent-queries', 'saved-queries', 'baskets']
    },
    {
      id: 'recent-documents',
      type: 'recent-documents',
      classes: 'col-md-5 col-lg-3 mb-3'
    },
    {
      id: 'recent-queries',
      type: 'recent-queries',
      classes: 'col-md-5 col-lg-3 mb-3'
    },
    {
      id: 'saved-queries',
      type: 'saved-queries',
      classes: 'col-md-5 col-lg-3 mb-3'
    },
    {
      id: 'baskets',
      type: 'baskets',
      classes: 'col-md-5 col-lg-3 mb-3'
    });

    return config;
  }

  predefinedResultsViews = [
    {
      name: 'List',
      icon: 'fas fa-list',
      config: [{
        id: 'results',
        type: '_container',
        items: ['result-left-side', 'result-thumbnail'],
        classes: 'record list-view'
      },
      {
        id: 'result-left-side',
        type: '_container',
        items: ['result-title-container', 'result-source', 'result-extracts', 'result-metas', 'result-missing-terms'],
        classes: 'flex-grow-1 overflow-hidden flex-column' // Overflow hidden is important for truncating long URLs
      },
      {
        id: 'result-title-container',
        type: '_container',
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
        type: '_container',
        items: ['result-labels-public', 'result-labels-private']
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
      }]
    },
    {
      name: 'Tiles',
      icon: 'fas fa-th-large',
      config: [{
        id: 'results',
        type: '_container',
        items: ['result-title-container', 'result-source', 'result-thumbnail', 'result-missing-terms'],
        classes: 'record tile-view flex-column align-items-stretch overflow-hidden'
      },
      {
        id: 'result-title-container',
        type: '_container',
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
