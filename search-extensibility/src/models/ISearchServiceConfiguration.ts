import { ICommonSearchProps, IRefinerConfiguration, IQueryModifierInstance, IRefinementFilter } from "..";

export interface ISearchServiceConfiguration {
    /**
     * Determines the number of items ot retrieve in REST requests
     */
    resultsCount: number;
    
    /**
     * Common properties for the search data source
     */
    config: ICommonSearchProps;

    /**
     * The managed properties used as refiners for the query
     */
    refiners?: IRefinerConfiguration[];
    
    /**
     * The selected filters that need to be applied on the search query
     */
    refinementFilters?: IRefinementFilter[];

    /**
     * The synonyms table
     */
    synonymTable?: { [key:string]: string[] };

    /**
     * The search query culture
     */
    queryCulture: number;

    /**
     * The time zone Id
     */
    timeZoneId?: number;

    /**
     * Query modifiers
     */
    queryModifier?: IQueryModifierInstance;

}