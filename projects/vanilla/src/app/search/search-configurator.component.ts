import { Component, OnDestroy, inject } from "@angular/core";
import { SearchService } from "@sinequa/components/search";
import { UIService } from "@sinequa/components/utils";
import { AppService } from "@sinequa/core/app-utils";
import { LoginService } from "@sinequa/core/login";
import { Record, Results } from "@sinequa/core/web-services";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-search-configurator',
  templateUrl: './search-configurator.component.html'
})
export class SearchConfiguratorComponent implements OnDestroy {

  metadata: string[] = [];

  loginService = inject(LoginService);
  appService = inject(AppService);
  ui = inject(UIService);

  private subs: Subscription;

  constructor(private readonly searchService: SearchService) {
    this.subs = this.searchService.resultsStream
      .subscribe(({ records } = {} as Results) => records && this.updateMetadata(records));
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }

  private updateMetadata(records: Record[]) {
    const set = new Set(this.metadata);
    records.forEach(r => {
      Object.keys(r)
      .filter(k => this.appService.getColumn(k))
      .forEach(k => set.add(k));
    });
    return this.metadata = [...set.values()];
  }

}