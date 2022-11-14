import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Action } from '@sinequa/components/action';
import { default_facet_components, FacetConfig } from '@sinequa/components/facet';
import { PreviewDocument, PreviewService } from '@sinequa/components/preview';
import { SearchService } from '@sinequa/components/search';
import { SelectionService } from '@sinequa/components/selection';
import { UIService } from '@sinequa/components/utils';
import { AppService, ValueItem } from '@sinequa/core/app-utils';
import { IntlService } from '@sinequa/core/intl';
import { LoginService } from '@sinequa/core/login';
import { Answer, AuditWebService, Record, Results } from '@sinequa/core/web-services';
import { FacetParams } from '../../config';
import { BsFacetDate } from '@sinequa/analytics/timeline';

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
  public showPassagesAction: Action;

  // Whether the left facet bar is shown
  public _showFilters = this.ui.screenSizeIsEqual('md');
  // Whether the menu is shown on small screens
  public _showMenu = false;

  public readonly facetComponents = {
    ...default_facet_components,
    "date": BsFacetDate
  }

  metadata: string[] = [];

  public results$: Observable<Results | undefined>;

  conditionsData: any;

  constructor(
    public appService: AppService,
    public previewService: PreviewService,
    public titleService: Title,
    public intlService: IntlService,
    public searchService: SearchService,
    public selectionService: SelectionService,
    public loginService: LoginService,
    public auditService: AuditWebService,
    public ui: UIService,
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

    // Display Neural Search passages, when they exist
    this.showPassagesAction = new Action({
      icon: "fas fa-brain",
      title: "Show/hide passages extracted by Neural Search",
      action: action => {
        action.selected = !action.selected
      },
      updater: action => {
        action.hidden = !this.openedDoc?.matchingpassages?.passages.length;
      }
    });

    this.previewCustomActions = [ expandPreviewAction, this.showPassagesAction ];

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
          if(results?.records) {
            this.updateMetadata(results?.records);
          }
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
  facetChanged(id: string, facet: FacetConfig<FacetParams>){
    if(!facet) {
      this.multiFacetMap.delete(id);
    }
    else {
      this.multiFacetMap.set(id, {icon: facet.icon || '', title: facet.title || facet.name || facet.parameters?.aggregation || ''});
    }
  }

  /**
   * Responds to a click on a document (setting openedDoc will open the preview facet)
   * @param record
   * @param event
   */
  onDocumentClicked(record: Record, event: Event) {
    if(!this.isClickAction(event)){
      this.openMiniPreview(record);
    }
  }

  openMiniPreview(record: Record) {
    this.openedDoc = record;
    this.showPassagesAction.update();
    if(this.ui.screenSizeIsLessOrEqual('md')){
      this._showFilters = false; // Hide filters on small screens if a document gets opened
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

  get showPassages(): boolean {
    return !this.showPassagesAction?.hidden && !!this.showPassagesAction?.selected;
  }

  onAnswerOpened(answer: Answer) {
    // Important to retrieve the "real" record if possible, as the one in the answer misses some metadata
    const record = this.searchService.results?.records.find(r => r.id === answer.$record?.id) || answer.$record;
    if (record) {
      this.openMiniPreview(record);
    }
  }

  updateMetadata(records: Record[]) {
    const set = new Set(this.metadata);
    records.forEach(r => {
      Object.keys(r)
        .filter(k => this.appService.getColumn(k))
        .forEach(k => set.add(k));
    });
    this.metadata = [...set.values()]
  }

  onMetadataSelect(item: string, valueItem: ValueItem) {
    this.searchService.addFieldSelect(item, valueItem);
    this.searchService.search();
  }

}
