import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Action } from '@sinequa/components/action';
import { BsFacetCard, DEFAULT_FACET_COMPONENTS, FacetConfig, FacetViewDirective } from '@sinequa/components/facet';
import { PreviewDocument, PreviewService } from '@sinequa/components/preview';
import { SearchService } from '@sinequa/components/search';
import { SelectionService } from '@sinequa/components/selection';
import { UIService } from '@sinequa/components/utils';
import { AppService, ValueItem } from '@sinequa/core/app-utils';
import { IntlService } from '@sinequa/core/intl';
import { LoginService } from '@sinequa/core/login';
import { Answer, AuditEventType, AuditWebService, Record, Results, TopPassage } from '@sinequa/core/web-services';
import { FacetParams } from '../../config';
import { BsFacetDate } from '@sinequa/analytics/timeline';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {

  // Dynamic display of facets titles/icons in the multi-facet component
  public multiFacetMap = new Map<string, { icon: string, title: string }>();

  // Document "opened" via a click (opens the preview facet)
  public openedDoc?: Record;

  // Custom action for the preview facet (open the preview route)
  public previewCustomActions: Action[];

  // Whether the left facet bar is shown
  public _showFilters = this.ui.screenSizeIsEqual('md');
  // Whether the menu is shown on small screens
  public _showMenu = false;

  public readonly facetComponents = {
    ...DEFAULT_FACET_COMPONENTS,
    "date": BsFacetDate
  }

  metadata: string[] = [];

  public results$: Observable<Results | undefined>;

  // Whether the results contain answers/passages data (neural search)
  public hasAnswers: boolean;
  public hasPassages: boolean;
  public passageId?: string;

  conditionsData: any;

  @ViewChild("previewFacet") previewFacet: BsFacetCard;
  @ViewChild("passagesList", { read: FacetViewDirective }) passagesList: FacetViewDirective;


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

    const expandAction = new Action({
      icon: "fas fa-fw fa-expand-alt",
      title: "msg#facet.preview.expandTitle",
      action: () => {
        if (this.openedDoc) {
          this.previewService.openRoute(this.openedDoc, this.searchService.query);
        }
      }
    });

    const closeAction = new Action({
      icon: "fas fa-fw fa-times",
      title: "msg#facet.preview.closeTitle",
      action: () => {
        this.closeDocument();
      }
    });

    this.previewCustomActions = [expandAction, closeAction];
  }

  /**
   * Initialize the page title
   */
  ngOnInit() {
    this.titleService.setTitle(this.intlService.formatMessage("msg#search.pageTitle", { search: "" }));

    // mutate results/records if desired, convert to switchMap or mergeMap if additional calls need to be chained
    // consult RxJS documentation for additional functionality like combineLatest, etc.
    this.results$ = this.searchService.resultsStream
      .pipe(
        tap(results => {
          if (results?.records) {
            this.updateMetadata(results?.records);
          }
        }),
        // Make it possible to display components conditionally based on the results (eg: tab) or query (eg: text)
        tap(results => this.conditionsData = { results, query: this.searchService.query }),
        tap(results => {
          this.titleService.setTitle(this.intlService.formatMessage("msg#search.pageTitle", { search: this.searchService.query.text || "" }));
          if (!this.showResults) {
            this.openedDoc = undefined;
            this._showFilters = false;
          }
          this.hasAnswers = !!results?.answers?.answers?.length;
          this.hasPassages = !!results?.topPassages?.passages?.length;
          if(results && results.records.length <= results.pageSize) {
            window.scrollTo({top: 0, behavior: 'auto'});
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
  facetChanged(id: string, facet: FacetConfig<FacetParams>) {
    if (!facet) {
      this.multiFacetMap.delete(id);
    }
    else {
      this.multiFacetMap.set(id, { icon: facet.icon || '', title: facet.title || facet.name || '' });
    }

  }


  /**
   * Controls visibility of filters (small screen sizes)
   */
  get showFilters(): boolean {
    return this.ui.screenSizeIsGreaterOrEqual('lg') || this._showFilters;
  }

  /**
   * Controls visibility of menu (small screen sizes)
   */
  get showMenu(): boolean {
    return this.ui.screenSizeIsGreaterOrEqual('sm') || (this._showMenu && !this._showFilters);
  }


  /**
   * On small screens only show the search form when the facets are displayed
   */
  get showForm(): boolean {
    return this.ui.screenSizeIsGreaterOrEqual('sm') || this.showFilters;
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

  onPreviewOpened(item: Answer | TopPassage) {
    if (item.$record) {
      this.openMiniPreview(item.$record);
    }
  }

  /**
   * Responds to a click on a document (setting openedDoc will open the preview facet)
   * @param record
   * @param event
   */
  onDocumentClicked(record: Record, event: Event) {
    if (!this.isClickAction(event)) {
      this.openMiniPreview(record);
    }
  }

  openMiniPreview(record: Record, passageId?: number) {
    this.openedDoc = record;
    this.passageId = passageId?.toString();
    if (this.passageId) {
      if (this.previewFacet && this.passagesList) {
        this.previewFacet.setView(this.passagesList);
      }
    }
    if (this.ui.screenSizeIsLessOrEqual('md')) {
      this._showFilters = false; // Hide filters on small screens if a document gets opened
    }
  }

  /**
   * Open the preview when this record has no url1
   * @param record
   * @param isLink
   */
  openPreviewIfNoUrl(record: Record, isLink: boolean) {
    if (!isLink) {
      this.previewService.openRoute(record, this.searchService.query);
    }
  }

  /**
   * Responds to the preview facet being closed by a user action
   */
  closeDocument() {
    if(this.openedDoc){
      this.auditService.notify({
        type: AuditEventType.Preview_Close,
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

  // Make sure the click is not meant to trigger an action (from sq-result-source or sq-result-title)
  private isClickAction(event: Event): boolean {
    const target = event.target as HTMLElement|null;
    return event.type !== 'click' || !!target?.matches("a, a *, input, input *, button, button *");
  }

  /**
   * Show or hide the left facet bar (small screen sizes)
   */
  toggleFilters() {
    this._showFilters = !this._showFilters;
    if (this._showFilters) { // Close document if filters are displayed
      this.openedDoc = undefined;
    }
  }

  /**
   * Show or hide the user menus (small screen sizes)
   */
  toggleMenu() {
    this._showMenu = !this._showMenu;
  }

  /**
  * Determine whether to show or hide results
  */
  get showResults(): boolean {
    if (this.ui.screenSizeIsLessOrEqual('sm')) {
      return !this.showFilters && !this.openedDoc;
    }
    return true;
  }

  onTitleClick(value: { item: Answer | TopPassage, isLink: boolean }) {
    if (value.item.$record) {
      this.openPreviewIfNoUrl(value.item.$record, value.isLink);
    }
  }
}
