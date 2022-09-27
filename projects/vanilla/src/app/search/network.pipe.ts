import { Pipe, PipeTransform } from "@angular/core";
import { AggregationEdgeType, NetworkProvider, ProviderFactory } from "@sinequa/analytics/network";
import { AppService } from "@sinequa/core/app-utils";
import { ComponentConfig } from "@sinequa/ngx-ui-builder";

export interface NetworkConfig extends ComponentConfig {
  nodeTypes: {
    icon: string;
    iconCode: string;
    color: string;
    field?: string;
  }[];
  providers: {
    type: 'records' | 'selected-records' | 'aggregations';
    fields: string[];
    aggregations: string[];
  }[];
}

@Pipe({name: "sqNetwork"})
export class NetworkPipe implements PipeTransform {

  constructor(
    public providerFactory: ProviderFactory,
    public appService: AppService
  ){}

  transform(value: NetworkConfig): (NetworkProvider|undefined)[] {
    const nodeTypes = value.nodeTypes.map(t =>
      this.providerFactory.createFontAwesomeNodeType(t.field!, t.iconCode, t.color, 50, t.field)
    );
    const providers: NetworkProvider[] = [];
    for(const p of value.providers) {
      if(p.type === 'aggregations' && p.aggregations) {
        const edgeTypes: AggregationEdgeType[] = [];
        for(let a of p.aggregations) {
          const conf = this.appService.getCCAggregation(a);
          if(conf) {
            const cols = conf.column.split('/');
            const nodes = cols.map(c => nodeTypes.find(n => n.field === c)!);
            if(nodes.every(n => n)) {
              edgeTypes.push(this.providerFactory.createAggregationEdgeType(nodes, a));
            }
          }
        }
        providers.push(this.providerFactory.createAggregationProvider(edgeTypes));
      }
      if(p.type === 'selected-records' && p.fields) {
        const recordType = this.providerFactory.createRecordNodeType();
        const fieldNodes = p.fields.map(f => {
          let nodeType = nodeTypes.find(n => n.field === f);
          if(!nodeType) {
            nodeType = this.providerFactory.createFontAwesomeNodeType(f, "\uf128", "#aaaaaa", 50, f);
          }
          return nodeType;
        });
        const edges = this.providerFactory.createStructuralEdgeTypes(recordType, fieldNodes);
        providers.push(this.providerFactory.createSelectedRecordsProvider(recordType, edges))
      }
    }
    return providers;
  }
}
