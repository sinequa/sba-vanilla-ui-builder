import { FacetListParams, FacetMySearchParams, FacetRangeParams, FacetRefineParams, FacetTagCloudParams, FacetTreeParams } from '@sinequa/components/facet';
import { FacetDateParams } from "@sinequa/analytics/timeline";
import { ComponentConfig } from '@sinequa/ngx-ui-builder';


/**
 * Use this flag to force the local configuration instead of using
 * the configuration store in user settings
 */
export const FORCE_LOCAL_CONFIG = false;

export const HOME_DEFAULT_CONFIG: ComponentConfig[] = [
  {
    id: 'home',
    type: '_container',
    classes: 'flex-column align-items-center',
    items: ['home-logo', 'home-title', 'search-form-wrapper', 'home-actions', 'home-facets', 'global']
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
    classes: 'sq-home-facet-bar container row justify-content-center mt-5',
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
    id: "global",
    type: "global"
  }
];

export const NAVBAR_DEFAULT_CONFIG: ComponentConfig[] = [
  {
    id: 'navbar',
    type: '_container',
    items: ['global','logo','search-form','baskets-menu','saved-queries-menu','labels-menu','alerts-menu','user-menu','feedback-menu'],
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
  }
];

export type FacetParams = FacetListParams | FacetTreeParams | FacetMySearchParams | FacetRangeParams | FacetRefineParams | FacetTagCloudParams | FacetDateParams;

export const FACETS_DEFAULT_CONFIG: ComponentConfig[] = [
  {
    id: 'facets',
    type: '_container',
    items: ["facet-treepath", "facet-geo", "facet-company", "facet-person", "facet-docformat", "facet-modified", "facet-size", "facet-documentlanguages", "facet-concepts"],
    classes: 'flex-column'
  },
  {
    id: "facet-treepath",
    name: "treepath",
    title: "msg#facet.treepath.title",
    type: "facet-tree",
    icon: "fas fa-sitemap",
    parameters: {
      aggregation: "Treepath",
      showCount: true,
      searchable: true,
      allowExclude: true,
      allowOr: true,
      allowAnd: false,
      displayEmptyDistributionIntervals: false,
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
    items: ['tabs','toolbar','did-you-mean','sponsored-results', 'answer-card', 'top-passages'],
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
    classes: 'flex-grow-1 flex-column'
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
    classes: 'mt-2',
    thumbnailColumn: 'sourcevarchar4',
    linkBehavior: 'action'
  }
]

export const PANEL_RIGHT_DEFAULT_CONFIG: ComponentConfig[] = [
  {
    id: "panel-right",
    type: "_container",
    items: ['preview'],
    classes: "flex-column align-items-stretch"
  },
  {
    id: "preview",
    type: "preview",
    metadata: ["authors", "docformat", "modified", "size", "treepath", "filename"],
    extracts: ["matchlocations", "extractslocations", "matchingpassages"],
    highlightActions: true,
    highlightEntities: true,
    highlightExtracts: true,
    metadataShowIcon: true,
    metadataShowTitle: true,
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
