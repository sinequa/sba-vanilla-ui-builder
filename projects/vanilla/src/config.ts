import { FacetDateParams } from "@sinequa/analytics/timeline";
import { ComponentConfig } from '@sinequa/ngx-ui-builder';
import { MetadataConfig } from '@sinequa/components/metadata';
import { FacetListParams, FacetRangeParams, FacetRefineParams, FacetTagCloudParams } from "@sinequa/components/facet";


/**
 * Use this flag to force the local configuration instead of using
 * the configuration store in user settings
 */
export const FORCE_LOCAL_CONFIG = false;
export const GLOBAL_CONFIG = undefined;

export const GLOBAL_DEFAULT_CONFIG = {
  id: "global",
  type: "global",
  appName: "msg#app.name",
  images: {
    backgroundImage: { filename: '' },
    favicon: { filename: '' }
  },
  entityHighlights: [
    {
      name: 'company',
      color: 'white',
      bgColor: '#FF7675'
    },
    {
      name: 'geo',
      color: 'white',
      bgColor: '#74B9FF'
    },
    {
      name: 'person',
      color: 'white',
      bgColor: '#00ABB5'
    },
    {
      name: 'extractslocations',
      color: 'black',
      bgColor: '#fffacd'
    },
    {
      name: 'matchlocations',
      color: 'black',
      bgColor: '#ff0'
    }
  ]
};

export const TRANSLATIONS_DEFAULT_CONFIG: ComponentConfig[] = [
  {
    id: "translations",
    type: "translations",
    translations: {
      en: {},
      fr: {},
      de: {}
    }
  }
];

export const HOME_DEFAULT_CONFIG: ComponentConfig[] = [
  {
    id: 'home',
    type: '_container',
    classes: 'd-flex align-items-center flex-column w-100',
    items: ['home-logo', 'home-title', 'search-form', 'home-actions', 'home-facets']
  },
  {
    id: 'home-logo',
    type: 'home-logo',
    images: {
      logoLight: { filename: 'assets/vanilla-logo.png' },
      logoDark: { filename: 'assets/vanilla-logo-dark.png' }
    }
  },
  {
    id: 'home-title',
    type: '_raw-html',
    rawHtml: "<h1>Vanilla Builder</h1>"
  },
  {
    id: 'home-facets',
    type: '_container',
    classes: 'sq-home-facet-bar col-9 d-flex gap-3 justify-content-center',
    items: ['recent-documents', 'recent-queries', 'saved-queries', 'baskets']
  },
  {
    id: 'recent-documents',
    type: 'recent-documents',
    classes: 'col-md-5 col-lg-3 m-0 mb-3',
    maxItems: 5
  },
  {
    id: 'recent-queries',
    type: 'recent-queries',
    classes: 'col-md-5 col-lg-3 m-0 mb-3',
    maxItems: 5
  },
  {
    id: 'saved-queries',
    type: 'saved-queries',
    classes: 'col-md-5 col-lg-3 m-0 mb-3',
    maxItems: 5
  },
  {
    id: 'baskets',
    type: 'baskets',
    classes: 'col-md-5 col-lg-3 m-0 mb-3',
    maxItems: 5
  },
  {
    id: 'search-form',
    type: 'search-form',
    classes: 'col-8 col-md-7 col-lg-5 col-xl-4 app-search-form px-2',
    autocompleteSources: ['suggests','baskets','recent-documents','recent-queries','saved-queries'],
    enableVoiceRecognition: true,
    keepTab: true,
    enableKeepFilters: true,
    keepFilters: true,
    enableAdvancedForm: true,
    keepAdvancedSearchFilters: true
  }
];

export const NAVBAR_DEFAULT_CONFIG: ComponentConfig[] = [
  {
    id: 'navbar',
    type: '_container',
    items: ['logo','nav-search-form','menus'],
    classes: 'd-flex flex-grow-1 align-items-center'
  },
  {
    id: "logo",
    type: "logo",
    classes: "col-lg-3 col-xl-2",
    images: {
      logoLightLg: { filename: "assets/sinequa-logo-light-lg.png", height: 40 },
      logoLightSm: { filename: "assets/sinequa-logo-light-sm.png", height: 40 },
      logoDarkLg: { filename: "assets/sinequa-logo-dark-lg.png", height: 40 },
      logoDarkSm: { filename: "assets/sinequa-logo-dark-sm.png", height: 40 }
    }
  },
  {
    id: 'nav-search-form',
    type: 'search-form',
    classes: 'col-5 app-search-form px-2',
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
  },
  {
    type: "_container",
    id: "menus",
    items: [
      "spacer-menu",
      "labels-menu",
      "baskets-menu",
      "saved-queries-menu",
      "alerts-menu",
      "user-menu",
      "feedback-menu"
    ],
    "classes": "d-flex w-100 align-items-center"
  },
  {
    type: "_container",
    id: "spacer-menu",
    classes: "w-100",
    items: []
  }
];
export type FacetParams = FacetListParams | FacetRangeParams | FacetRefineParams | FacetTagCloudParams | FacetDateParams;
export const FACETS_DEFAULT_CONFIG: ComponentConfig[] = [
  {
    id: 'facets',
    type: '_container',
    items: ["facet-treepath", "facet-geo", "facet-company", "facet-person", "facet-docformat", "facet-modified", "facet-size", "facet-documentlanguages", "facet-concepts"],
    classes: 'd-flex flex-column gap-3'
  },
  {
    id: "facet-treepath",
    name: "treepath",
    title: "msg#facet.treepath.title",
    type: "facet-list",
    icon: "fas fa-sitemap",
    parameters: {
      aggregation: "Treepath",
      showCount: true,
      searchable: true,
      allowExclude: true,
      allowOr: true,
      allowAnd: false,
      displayEmptyDistributionIntervals: false,
      acceptNonAggregationItemFilter: true,
      expandedLevel: 2
    }
  },
  {
    id: "facet-geo",
    name: "geo",
    title: "msg#facet.geo.title",
    type: "facet-list",
    icon: "fas fa-globe-americas",
    parameters: {
      aggregation: "Geo",
      showCount: true,
      searchable: true,
      allowExclude: true,
      allowOr: true,
      allowAnd: false,
      displayEmptyDistributionIntervals: false,
    }
  },
  {
    id: "facet-company",
    name: "company",
    title: "msg#facet.company.title",
    type: "facet-list",
    icon: "fas fa-building",
    parameters: {
      aggregation: "Company",
      showCount: true,
      searchable: true,
      allowExclude: true,
      allowOr: true,
      allowAnd: false,
      displayEmptyDistributionIntervals: false,
    }
  },
  {
    id: "facet-person",
    name: "person",
    title: "msg#facet.person.title",
    type: "facet-list",
    icon: "fas fa-user",
    parameters: {
      aggregation: "Person",
      showCount: true,
      searchable: true,
      allowExclude: true,
      allowOr: true,
      allowAnd: false,
      displayEmptyDistributionIntervals: false,
    }
  },
  {
    id: "facet-docformat",
    name: "docformat",
    title: "msg#facet.docformat.title",
    type: "facet-list",
    icon: "far fa-file-word",
    parameters: {
      aggregation: "DocFormat",
      showCount: true,
      searchable: true,
      allowExclude: true,
      allowOr: true,
      allowAnd: false,
      displayEmptyDistributionIntervals: false,
    }
  },
  {
    id: "facet-modified",
    name: "modified",
    title: "msg#facet.modified.title",
    type: "facet-date",
    icon: "fas fa-calendar-day",
    parameters: {
      aggregation: "Modified",
      timelineAggregation: "Timeline",
      showCount: true,
      allowPredefinedRange: true,
      allowCustomRange: true,
      showCustomRange: true,
      replaceCurrent: true,
      displayEmptyDistributionIntervals: true
    }
  },
  {
    id: "facet-size",
    name: "size",
    title: "msg#facet.size.title",
    type: "facet-list",
    icon: "fas fa-sort-amount-up-alt",
    parameters: {
      aggregation: "Size",
      showCount: true,
      searchable: false,
      allowExclude: true,
      allowOr: true,
      allowAnd: false,
      displayEmptyDistributionIntervals: false,
    }
  },
  {
    id: "facet-documentlanguages",
    name: "documentlanguages",
    title: "msg#facet.documentlanguages.title",
    type: "facet-list",
    icon: "far fa-comment",
    parameters: {
      aggregation: "DocumentLanguages",
      showCount: true,
      searchable: true,
      allowExclude: true,
      allowOr: true,
      allowAnd: false,
      displayEmptyDistributionIntervals: false,
    }
  },
  {
    id: "facet-concepts",
    name: "concepts",
    title: "msg#facet.concepts.title",
    type: "facet-list",
    icon: "fas fa-comment-dots",
    parameters: {
      aggregation: "Concepts",
      showCount: true,
      searchable: false,
      allowExclude: true,
      allowOr: true,
      allowAnd: false,
      displayEmptyDistributionIntervals: false,
    }
  }
];

export const TOOLBAR_DEFAULT_CONFIG: ComponentConfig[] = [
  {
    id: 'results-header',
    type: '_container',
    items: ['tabs', 'top-passages', 'toolbar','did-you-mean','sponsored-results', 'answer-card'],
    classes: 'd-flex flex-column'
  },
  {
    id: "tabs",
    type: "tabs",
    classes: "mb-3"
  },
  {
    id: 'toolbar',
    type: '_container',
    items: ['filters-view', 'result-counter', 'sort-selector'],
    classes: "d-flex justify-content-end gap-2 align-items-center"
  },
  {
    id: 'filters-view',
    type: 'filters-view',
    classes: 'flex-grow-1 small',
    allowDeletion: true
  },
  {
    id: 'sort-selector',
    type: 'sort-selector',
    rightAligned: true
  }
];

export const RESULTS_VIEW_LIST_CONFIG: ComponentConfig[] = [
  {
    id: 'results',
    type: '_container',
    items: ['result-left-side', 'result-thumbnail'],
    classes: 'record list-view'
  },
  {
    id: 'result-left-side',
    type: '_container',
    items: ['result-title-container', 'result-source', 'result-extracts', 'result-metas', 'result-missing-terms'],
    classes: 'd-flex flex-column'
  },
  {
    id: 'result-title-container',
    type: '_container',
    items: ['result-selector', 'result-title'],
    classes: 'd-flex align-items-center'
  },
  {
    id: 'result-title',
    type: 'result-title',
    classes: 'overflow-hidden'
  },
  {
    id: 'result-metas',
    type: '_container',
    items: ['result-labels-public', 'result-labels-private'],
    classes: "d-flex"
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
    id: 'result-extracts',
    type: 'result-extracts',
    classes: 'overflow-hidden'
  }
];

export const RESULTS_VIEW_TILES_CONFIG: ComponentConfig[] = [
  {
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
    classes: 'align-self-center ms-3',
    thumbnailColumn: 'sourcevarchar4',
    linkBehavior: 'action'
  }
]

export const PANEL_RIGHT_DEFAULT_CONFIG: ComponentConfig[] = [
  {
    id: "panel-right",
    type: "_container",
    items: ['preview'],
    classes: "d-flex flex-column align-items-stretch"
  },
  {
    id: "preview",
    type: "preview",
    metadata: {
      items: ["authors", "docformat", "modified", "size", "treepath", "filename"],
      layout: 'table'
    },
    extracts: ["matchlocations", "extractslocations", "matchingpassages"],
    highlightActions: true,
    highlightEntities: true,
    highlightExtracts: true,
    height: 750,
    condition: { // This condition ensures the preview is only shown when a document is open
      type: 'equals',
      field: 'id',
      values: [{not: true, value: ''}]
    },
    classes: "mb-3"
  }
];

export const VANILLA_BUILDER_DEFAULT_CONFIG: ComponentConfig[] = [
  GLOBAL_DEFAULT_CONFIG,
  ...TRANSLATIONS_DEFAULT_CONFIG,
  ...HOME_DEFAULT_CONFIG,
  ...NAVBAR_DEFAULT_CONFIG,
  ...FACETS_DEFAULT_CONFIG,
  ...TOOLBAR_DEFAULT_CONFIG,
  ...RESULTS_VIEW_LIST_CONFIG,
  ...PANEL_RIGHT_DEFAULT_CONFIG
];

export const RESULTS_VIEWS_CONFIG = [
  {
    name: 'List',
    icon: 'fas fa-list',
    config: RESULTS_VIEW_LIST_CONFIG
  },
  {
    name: 'Tiles',
    icon: 'fas fa-th-large',
    config: RESULTS_VIEW_TILES_CONFIG
  }
];

export const METADATA_CONFIG: MetadataConfig[] = [
  {
      field: "authors",
      label: "msg#metadata.authorsPluralLabel",
      icon: "fas fa-user-edit"
  },
  {
      field: "docformat",
      label: "msg#metadata.docformatLabel",
      icon: "fas fa-info-circle"
  },
  {
      field: "modified",
      label: "msg#metadata.modifiedLabel",
      icon: "far fa-calendar-alt"
  },
  {
      field: "size",
      label: "msg#metadata.size_label",
      icon: "fas fa-weight-hanging"
  },
  {
      field: "treepath",
      label: "msg#metadata.treepath_label",
      icon: "fas fa-folder-open"
  },
  {
      field: "filename",
      label: "msg#metadata.filename_label",
      icon: "far fa-file-alt"
  }
];