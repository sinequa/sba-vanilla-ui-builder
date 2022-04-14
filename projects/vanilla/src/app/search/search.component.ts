import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { Action } from '@sinequa/components/action';
import { FacetConfig } from '@sinequa/components/facet';
import { PreviewDocument, PreviewService } from '@sinequa/components/preview';
import { SearchService } from '@sinequa/components/search';
import { SelectionService } from '@sinequa/components/selection';
import { UIService } from '@sinequa/components/utils';
import { AppService, ValueItem } from '@sinequa/core/app-utils';
import { IntlService } from '@sinequa/core/intl';
import { LoginService } from '@sinequa/core/login';
import { AuditWebService, DownloadWebService, JsonMethodPluginService, Record, Results } from '@sinequa/core/web-services';
import { FACETS, FEATURES, METADATA } from '../../config';
import { ConfigService } from '@sinequa/ngx-ui-builder';
import { AppConfigService } from '../app-config.service';
import { NotificationsService } from '@sinequa/core/notification';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  // Dynamic display of facets titles/icons in the multi-facet component
  public multiFacetMap = new Map<string, {icon: string, title: string}>();

  // Document "opened" via a click (opens the preview facet)
  public openedDoc?: Record;

  // Custom action for the preview facet (open the preview route)
  public previewCustomActions: Action[];

  // Whether the left facet bar is shown
  public _showFilters = this.ui.screenSizeIsEqual('md');
  // Whether the menu is shown on small screens
  public _showMenu = false;

  public results$: Observable<Results | undefined>;

  conditionsData: any;

  constructor(
    private previewService: PreviewService,
    private titleService: Title,
    private intlService: IntlService,
    private appService: AppService,
    public searchService: SearchService,
    public selectionService: SelectionService,
    public loginService: LoginService,
    public auditService: AuditWebService,
    public ui: UIService,
    public pluginService: JsonMethodPluginService,
    public downloadService: DownloadWebService,
    public configService: ConfigService,
    public appConfigService: AppConfigService,
    public notificationsService: NotificationsService
  ) {

    // Initialize the facet preview action (opens the preview route)
    const expandPreviewAction = new Action({
      icon: "fas fa-expand-alt",
      title: "msg#facet.preview.expandTitle",
      action: () => {
        if (this.openedDoc) {
          this.previewService.openRoute(this.openedDoc, this.searchService.query);
        }
      }
    });

    this.previewCustomActions = [ expandPreviewAction ];
  }

  /**
   * Initialize the page title
   */
  ngOnInit() {
    this.titleService.setTitle(this.intlService.formatMessage("msg#search.pageTitle", {search: ""}));

    // mutate results/records if desired, convert to switchMap or mergeMap if additional calls need to be chained
    // consult RxJS documentation for additional functionality like combineLatest, etc.
    this.results$ = this.searchService.resultsStream
      .pipe(
        tap(results => {
          // Make it possible to display components conditionally based on the results (eg: tab) or query (eg: text)
          this.conditionsData = {results, query: this.searchService.query};
          this.titleService.setTitle(this.intlService.formatMessage("msg#search.pageTitle", {search: this.searchService.query.text || ""}));
          if (!this.showResults) {
            this.openedDoc = undefined;
            this._showFilters = false;
          }
        })
      );
  }

  /**
   * Returns the configuration of the facets displayed in the facet-multi component.
   * The configuration from the config.ts file can be overriden by configuration from
   * the app configuration on the server
   */
  public get facets(): FacetConfig[] {
    return this.appService.app?.data?.facets as any as FacetConfig[] || FACETS;
  }

  /**
   * Returns the list of features activated in the top right menus.
   * The configuration from the config.ts file can be overriden by configuration from
   * the app configuration on the server
   */
  public get features(): string[] {
    return this.appService.app?.data?.features as string[] || FEATURES;
  }

  /**
   * Returns the configuration of the metadata displayed in the facet-preview component.
   * The configuration from the config.ts file can be overriden by configuration from
   * the app configuration on the server
   */
  public get metadata(): string[] {
    return this.appService.app?.data?.metadata as string[] || METADATA;
  }

  getMultiFacetIcon(id: string, def: string) {
    return this.multiFacetMap.get(id)?.icon ?? def;
  }

  getMultiFacetTitle(id: string, def: string) {
    return this.multiFacetMap.get(id)?.title ?? def;
  }

  /**
   * Responds to a change of facet in the multi facet
   * @param facet
   */
  facetChanged(id: string, facet: FacetConfig){
    if(!facet) {
      this.multiFacetMap.delete(id);
    }
    else {
      this.multiFacetMap.set(id, {icon: facet.icon || '', title: facet.title});
    }
  }

  /**
   * Responds to a click on a document (setting openedDoc will open the preview facet)
   * @param record
   * @param event
   */
  onDocumentClicked(record: Record, event: Event) {
    if(!this.isClickAction(event)){
      this.openedDoc = record;
      if(this.ui.screenSizeIsLessOrEqual('md')){
        this._showFilters = false; // Hide filters on small screens if a document gets opened
      }
    }
  }

  /**
   * Open the preview when this record has no url1
   * @param record
   * @param isLink
   */
  openPreviewIfNoUrl(record: Record, isLink: boolean) {
    if(!isLink){
      this.previewService.openRoute(record, this.searchService.query);
    }
  }

  /**
   * Responds to the preview facet being closed by a user action
   */
  closeDocument(){
    if(this.openedDoc){
      this.auditService.notify({
        type: "Preview.close",
        detail: this.previewService.getAuditPreviewDetail(this.openedDoc.id, this.searchService.query, this.openedDoc, this.searchService.results?.id)
      });
      this.openedDoc = undefined;
      if(this.ui.screenSizeIsEqual('md')){
        this._showFilters = true; // Show filters on medium screen when document is closed
      }
    }
  }

  /**
   * Document is loaded and displayed on screen. It could be manipulated easily.
   *
   * eg: scroll to a specific location
   * document.getContentWindow().scrollTo(0, 3000);
   * @param document the document currently in preview
   */
  previewReady(document: PreviewDocument) {
    // document.getContentWindow().scrollTo(0, Math.random() * 4000);
  }

  // VERY SPECIFIC TO THIS APP:
  // Make sure the click is not meant to trigger an action (from sq-result-source or sq-result-title)
  private isClickAction(event: Event): boolean {
    if (event.type !== 'click') {
      return true;
    }
    const target = event.target as HTMLElement;
    if (!target) {
      return false;
    }
    return event.type !== 'click' ||
      target.tagName === "A" ||
      target.tagName === "INPUT" ||
      target.matches("sq-result-selector *, .sq-result-title, sq-result-source *, .sq-metadata-item-values *, sq-labels *");
  }


  /**
   * Controls visibility of filters (small screen sizes)
   */
  get showFilters(): boolean {
    return this.ui.screenSizeIsGreaterOrEqual('lg') || this._showFilters;
  }

  /**
   * Show or hide the left facet bar (small screen sizes)
   */
  toggleFilters(){
    this._showFilters = !this._showFilters;
    if(this._showFilters){ // Close document if filters are displayed
      this.openedDoc = undefined;
    }
  }

  /**
   * Controls visibility of menu (small screen sizes)
   */
  get showMenu(): boolean {
    return this.ui.screenSizeIsGreaterOrEqual('sm') || (this._showMenu && !this._showFilters);
  }

  /**
   * Show or hide the user menus (small screen sizes)
   */
  toggleMenu(){
    this._showMenu = !this._showMenu;
  }

  /**
   * Determine whether to show or hide results
   */
  get showResults(): boolean {
    if(this.ui.screenSizeIsLessOrEqual('sm')){
      return !this.showFilters && !this.openedDoc;
    }
    return true;
  }

  /**
   * On small screens only show the search form when the facets are displayed
   */
  get showForm(): boolean {
    return this.ui.screenSizeIsGreaterOrEqual('sm') || this.showFilters;
  }

  /**
   * Whether the UI is in dark or light mode
   */
  isDark(): boolean {
    return document.body.classList.contains("dark");
  }

  onMetadataSelect(item: string, valueItem: ValueItem) {
    this.searchService.addFieldSelect(item, valueItem);
    this.searchService.search();
  }


  resetConfig() {
    this.appConfigService.reset();
  }

  exportInProgress: boolean;
  exportApp() {
    if(this.exportInProgress) return;
    this.exportInProgress = true;
    const workspaceName = this.appService.app?.workspaceApp.split('/')[2]; // '/_sba/ws11.5.1.69/projects/vanilla-search/'
    if(workspaceName) {
      const config = this.configService.getAllConfig();
      const download$ = this.pluginService.post("MakeStaticWorkspace", {workspaceName, config}, {params: {noNotify: true}})
        .pipe(
          catchError(err => {
            this.notificationsService.error("Make sure you install the following JSON method plugin: https://github.com/sinequa/sba-vanilla-ui-builder/blob/develop/UiBuilderPlugin.cs")
            return throwError(err);
          }),
          switchMap(value => {
            const zipName = value?.zipName;
            if(zipName) {
              return this.pluginService.post("DownloadExportedWorkspace", {workspaceName, zipName}, {observe: 'response', responseType: 'blob'});
            }
            throw "Missing Zip file name from response";
          }),
          finalize(() => this.exportInProgress = false)
        );
      this.downloadService.download(download$).subscribe();
    }
  }

  exportConfig() {
    const config = JSON.stringify(this.configService.getAllConfig(), null, 2);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(config));
    element.setAttribute('download', "config.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  importConfig(importConfigElement: HTMLInputElement) {
    const file = importConfigElement.files?.[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = () => {
        const config = JSON.parse(reader.result as string);
        this.configService.set(config);
      }
      reader.readAsText(file, 'utf-8');
    }
  }
}
