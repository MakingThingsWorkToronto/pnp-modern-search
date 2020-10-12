import { PageContext } from '@microsoft/sp-page-context';
import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ITokenService, ITemplateService, ISortFieldConfiguration, ISortFieldDirection,
    ICommonSearchProps, ISearchServiceConfiguration, ISearchVertical, 
    IManagedPropertyInfo, IRefinementFilter, IRefinerConfiguration, ISearchResults, 
    ISearchVerticalInformation, RefinerSortDirection, RefinersSortOption, IExtensionContext, ExtensionTypes, ISearchServiceInitializer, ISearchParams } from 'search-extensibility';
import { IGraphSearchService,IGraphContentSource } from './IGraphSearchService';
import { IPropertyPaneGroup, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import { ISearchResultsWebPartProps } from '../../webparts/searchResults/ISearchResultsWebPartProps';
import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { TokenService } from '../TokenService/TokenService';

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

    public extensionType: string = ExtensionTypes.SearchDatasource;
    public context: IExtensionContext = null;

    public entityTypes:string[];
    public enableTopResults: boolean;
    public contentSources : IGraphContentSource[];
    public config: ICommonSearchProps;

    public resultsCount: number;
    public refiners?: IRefinerConfiguration[];
    public refinementFilters?: IRefinementFilter[];
    public synonymTable?: { [key: string]: string[]; };
    public queryCulture: number;
    public timeZoneId?: number;
    public queryModifier?: any;
    public useOldIcons: boolean = false;

    private _webPartContext: WebPartContext = null;
    private _tokenService: ITokenService = null;
    private _templateService: ITemplateService = null;

    private sortableProperties : string[] = [ "PersonalScore" ];
    private refineableProperties: IManagedPropertyInfo[] = [
        {
            name: "LastModifiedTime",
            sortable: false
        }
    ];

    public constructor() {
        this._configureDefaultParams();
    }
    
    public async init(config: ISearchServiceInitializer) : Promise<void> {
        
        this._tokenService = config.tokenService;
        this._webPartContext = config.webPartContext;
        this._templateService = config.templateService;
        this.config = config.config; 

    }
    
    public async search(p: ISearchParams): Promise<ISearchResults> {

        const page : number = typeof p.pageNumber === "number" ? p.pageNumber : 1;
        const startRow : number = (page-1)* this.resultsCount;
        const client = await this._webPartContext.msGraphClientFactory.getClient();
        const request = {
            requests: [
                {
                    entityTypes: this.entityTypes,
                    query: {
                        queryString: p.kqlQuery // + " " + await this._tokenService.replaceQueryVariables(this.config.queryTemplate)
                    },
                    from: startRow,
                    size: this.resultsCount,
                    fields: this.config.selectedProperties
                } as any
            ]
        };

        if(this.config.sortList && this.config.sortList.length > 0) {
            request.requests[0].sortableProperties = this.config.sortList.map((value: ISortFieldConfiguration)=>{
                    return {
                        name: value.sortField,
                        isDescending: value.sortDirection === ISortFieldDirection.Descending  ? "true" : "false"
                    };
                });
        }

        if(this.contentSources && this.contentSources.length>0) {
            request.requests[0].contentSources = this.contentSources.map((c)=>{return c.name;});
        }

        if(this.refinementFilters && this.refinementFilters.length > 0) {
            request.requests[0].aggregationFilters = this.refinementFilters.map((value:IRefinementFilter)=>{
                return `${value.FilterName}:"${value.Values.join(",")}"`;
            });
        }

        if(this.refiners && this.refiners.length > 0) {
            request.requests[0].aggregations = this.refiners.map((value:IRefinerConfiguration,index:number,array:IRefinerConfiguration[]) => {
                return {
                    field: value.refinerName,
                    size: 50000, //value.refinerSize,
                    bucketDefinition: {
                        sortBy: (value.refinerSortType === RefinersSortOption.ByNumberOfResults ? "count" : "keyAsString"),
                        isDescending: (value.refinerSortDirection === RefinerSortDirection.Descending ? "true" : "false"),
                        minimumCount: 0
                    }
                };
            });
        }

        const response = await client.api("search/query").version("beta").post(request);
        const results = this._parseResponse(response);
        results.QueryKeywords = p.kqlQuery;
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

    public getEntityTypes(): string[] {
        const types = Object.keys(GraphSearchEntityTypes);
        return types.filter((value:string,index:number)=>types.indexOf(value)===index);
    }

    public async suggest(query: string): Promise<string[]> {
        // call the search interface for 10 results & convert to string list?
        throw new Error("Method not implemented.");
    }
    
    public getConfiguration(): ISearchServiceConfiguration {
        return {
            config: this.config,
            refinementFilters: this.refinementFilters,
            refiners: this.refiners,
            resultsCount: this.resultsCount,
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
    
    public async getSearchVerticalCounts(queryText: string, searchVerticals: ISearchVertical[]): Promise<ISearchVerticalInformation[]> {
        throw new Error("Method not implemented.");
    }

    public async getAvailableQueryLanguages(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

    private _configureDefaultParams(){
        if(isEmpty(this.entityTypes) || this.entityTypes.length === 0) this.entityTypes = [ GraphSearchEntityTypes.listItem ];
        if(!(typeof this.enableTopResults === "boolean")) this.enableTopResults = true;
        if(!this.contentSources) this.contentSources = [];
    }
  
    public getPropertyPane(props: ISearchResultsWebPartProps) : IPropertyPaneGroup {
        const allEntityTypes = this.getEntityTypes();
        return {
            groupName: "Graph",
            groupFields: [
                PropertyFieldMultiSelect("params.entityTypes", {
                    key: "params.entityTypes",
                    label: "Entity Types",
                    options: allEntityTypes.map((t)=>{ return {key: t, text: t};}),
                    selectedKeys: props.params.entityTypes || [ GraphSearchEntityTypes.listItem ]
                }),
                PropertyPaneToggle("params.enableTopResults", {
                    key: "params.enableTopResults",
                    label: "Enable Top Results",
                    checked: props.params.enableTopResults
                }),
                PropertyFieldCollectionData("params.contentSources", {
                    key: "params.contentSources",
                    label: "Content Sources",
                    panelHeader: "Content Sources are only supported for external items.",
                    manageBtnLabel: "Content Sources",
                    value: props.params.contentSources,
                    enableSorting: true,
                    fields : [
                        {
                            id: "name",
                            title: "Name",
                            type: CustomCollectionFieldType.string,
                            placeholder: "Enter Content Source Name",
                            required: true
                        }
                    ]
                })
            ],
            isCollapsed: false
        };
    
    }

    public getHashKey() : string {
        return this.entityTypes.join("-") 
            + (this.contentSources && this.contentSources.length > 0)
                ? "-" + this.contentSources.join("-")
                : "";
    }

}

export default GraphSearchService;