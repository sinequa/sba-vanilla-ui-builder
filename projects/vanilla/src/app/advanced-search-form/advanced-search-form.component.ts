import { Component, Input, ViewChild } from "@angular/core";
import { SearchService } from "@sinequa/components/search";
import { Query } from "@sinequa/core/app-utils";
import { SearchFormComponent } from "@sinequa/components/search-form";
import { DEFAULT_FACET_COMPONENTS, FacetConfig } from "@sinequa/components/facet";
import { BsFacetDate } from "@sinequa/analytics/timeline";
import { FacetParams } from "../../config";

@Component({
  selector: 'app-advanced-search-form',
  templateUrl: './advanced-search-form.component.html',
  styles: [`
  :host {
    position: relative;
    display: block;
  }
  `],
})
export class AdvancedSearchFormComponent {

  /** List of autocomplete sources displayed by the autocomplete */
  @Input() autocompleteSources?: string[];
  /** List of facets displayed in the facet editor */
  @Input() facets?: FacetConfig<FacetParams>[];
  /** Route where a new search navigates to */
  @Input() searchRoute = "search";
  /** Mapping of facet types to facet components */
  @Input()
  facetComponents = {
    ...DEFAULT_FACET_COMPONENTS,
    "date": BsFacetDate
  }


  @ViewChild("searchForm") searchForm: SearchFormComponent;

  constructor(
    public searchService: SearchService
  ) { }

  onAutocompleteSearch(text: string, query: Query) {
    query.text = text;
    this.searchForm.applyFilters(); // Apply the autocomplete query and close the form
  }

  onFiltersChange() {
    this.searchForm.onFiltersChanged();
  }

}
