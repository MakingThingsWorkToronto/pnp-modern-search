import { IGraphSearchParams } from './IGraphSearchParams';
import { ISearchServiceConfiguration } from '../../models/ISearchServiceConfiguration';
import { PageContext } from '@microsoft/sp-page-context';
import { TokenService } from '../TokenService';
import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SortDirection,Sort } from '@pnp/sp';
import { IManagedPropertyInfo, IRefinerConfiguration, ISearchResults, ISearchVerticalInformation, RefinerSortDirection, RefinersSortOption } from 'search-extensibility';
import ITemplateService from '../TemplateService/ITemplateService';
import { IGraphSearchService } from './IGraphSearchService';
import { IPropertyPaneGroup } from '@microsoft/sp-property-pane';

export enum GraphSearchEntityTypes {
    message = "message",
    event = "event",
    drive = "drive",
    driveItem = "driveItem",
    list = "list",
    listItem = "listItem",
    site = "site",
    externalItem = "externalItem"
}

export class GraphSearchService implements IGraphSearchService {

    public entityTypes:string[];
    public resultsCount: number;
    public selectedProperties: string[];
    public queryTemplate?: string;
    public resultSourceId?: string;
    public sortList?: Sort[];
    public enableQueryRules?: boolean;
    public refiners?: IRefinerConfiguration[];
    public refinementFilters?: string[];
    public synonymTable?: { [key: string]: string[]; };
    public queryCulture: number;
    public timeZoneId?: number;
    public includeOneDriveResults?: boolean;
    public queryModifier?: any;

    private _pageContext: PageContext = null;
    private _webPartContext: WebPartContext = null;
    private _tokenService: TokenService = null;
    private _templateService: ITemplateService = null;
    private sortableProperties : string[] = [
        "PersonalScore"
    ];
    private refineableProperties: IManagedPropertyInfo[] = [
        {
            name: "LastModifiedTime",
            sortable: false
        }
    ];

    public constructor(pageContext: PageContext, webPartContext: WebPartContext, spHttpClient: SPHttpClient) {
        this._pageContext = pageContext;
        this._tokenService = new TokenService(this._pageContext, spHttpClient);
        this._webPartContext = webPartContext;
    }

    public async search(kqlQuery: string, searchParams: IGraphSearchParams): Promise<ISearchResults> {

        const page : number = typeof searchParams.pageNumber === "number" ? searchParams.pageNumber : 1;
        const startRow : number = (page-1)* this.resultsCount;
        const client = await this._webPartContext.msGraphClientFactory.getClient();
        //const appliedRefiners = this.refinementFilters.map((value:IRe))
        const requestRefiners = !this.refiners || this.refiners.length === 0 
                ? [] 
                : this.refiners.map((value:IRefinerConfiguration,index:number,array:IRefinerConfiguration[]) => {
                        return {
                            field: value.refinerName,
                            size: 100, //value.refinerSize,
                            bucketDefinition: {
                                sortBy: (value.refinerSortType === RefinersSortOption.ByNumberOfResults ? "count" : "keyAsString"),
                                isDescending: (value.refinerSortDirection === RefinerSortDirection.Descending ? "true" : "false"),
                                minimumCount: 0
                            }
                        };
                    });

        const request = {
            requests: [
                {
                    contentSources: this._getResultSources(),
                    entityTypes: this.entityTypes,
                    query: {
                        query_string: kqlQuery + " " + this.queryTemplate
                    },
                    aggregations: requestRefiners,
                    from: startRow,
                    size: this.resultsCount,
                    stored_fields: this._getStoredFields()
                }
            ]
        };

        const response = await client.api("search/query").version("beta").post(request);

        const results = this._parseResponse(response);
        results.QueryKeywords = kqlQuery;
        results.PaginationInformation.CurrentPage = page;
        results.PaginationInformation.MaxResultsPerPage = this.resultsCount;
        
        return results;

    }

    private _parseResponse(response:any) : ISearchResults {
 
        let results: ISearchResults = {
            QueryKeywords: "",
            RelevantResults: [],
            SecondaryResults: [],
            RefinementResults: [],
            PaginationInformation: {
                CurrentPage: 1,
                MaxResultsPerPage: 0,
                TotalRows: 0
            }
        };

        if(response  && response.value  && response.value.length > 0
            && response.value[0].hitsContainers  && response.value[0].hitsContainers.length > 0
            && response.value[0].hitsContainers[0].hits && response.value[0].hitsContainers[0].hits.length > 0) {
       
            // Map the JSON response to the output array
            response.value[0].hitsContainers[0].hits.map((item: any) => {
                let res : any = {};

                item.map((props:string, key:string)=>{
                    const newKey = key.startsWith("_") ? key.substr(1): key;
                    res[newKey] = props;
                });

                if(item._source) {
                    if (item._source.webLink) {
                        item.link = item._source.webLink;
                    }
                    if (item._source.webUrl) {
                        item.link = item._source.webUrl;
                    }
                    /*
                    if (this.state.resultType == 'event') {
                        item.link = "https://outlook.office365.com/calendar/view/month";
                    }
                    */
                }

                item.type = item._source["@odata.type"];

            });

        }

        return results;

    }

    private _getStoredFields():string[] {
        if(this.resultSourceId.indexOf("externalItem") >= -1) return this.selectedProperties;
        return [];
    }

    public getEntityTypes(): string[] {
        const types = Object.keys(GraphSearchEntityTypes);
        return types.filter((value:string,index:number)=>types.indexOf(value)===index);
    }

    private _getResultSources(): string[] {
        if(this.resultSourceId) {
            return this.resultSourceId.split(","); // split the result source IDs by commans
        } else if(!this.includeOneDriveResults) {
            return ["SharePoint","Exchange","PowerBI"];
        } else {
            return ["SharePoint","Exchange","OneDriveBusiness","PowerBI"];
        }
    }

    private _getSort():any {
        return this.sortList.map((sl) => {
            return {
                Field: sl.Property,
                SortDirection: sl.Direction === SortDirection.Ascending
                    ? "Asc"
                    : "Desc"
            };
        });
    }
    
    public async suggest(query: string): Promise<string[]> {
        // call the search interface for 10 results & convert to string list?
        throw new Error("Method not implemented.");
    }
    
    public getConfiguration(): ISearchServiceConfiguration {
        return {
            enableQueryRules: this.enableQueryRules,
            queryTemplate: this.queryTemplate,
            refinementFilters: this.refinementFilters,
            refiners: this.refiners,
            resultSourceId: this.resultSourceId,
            resultsCount: this.resultsCount,
            selectedProperties: this.selectedProperties,
            sortList: this.sortList,
            synonymTable: this.synonymTable,
            queryCulture: this.queryCulture
        } as ISearchServiceConfiguration; 
    }
    
    public async getAvailableManagedProperties(): Promise<IManagedPropertyInfo[]> {
        return this.refineableProperties;
    }
    
    public async validateSortableProperty(property: string): Promise<boolean> {
        return this.sortableProperties.filter((prop)=>prop === property).length>0;
    }
    
    public async getSearchVerticalCounts(queryText: string, searchVerticals: import("../../models/ISearchVertical").ISearchVertical[], enableQueryRules: boolean): Promise<ISearchVerticalInformation[]> {
        throw new Error("Method not implemented.");
    }

    public async getAvailableQueryLanguages(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

    public initializeTemplateService(svc:ITemplateService): void {
        this._templateService = svc;
    }
  
    public async getPropertyPane() : Promise<IPropertyPaneGroup> {
        
        return {
            groupName: "Mock Datasource",
            groupFields: [],
            isCollapsed: false
        };
    
    }
}

export default GraphSearchService;