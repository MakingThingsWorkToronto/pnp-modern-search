import { ISearchService } from "search-extensibility";

export interface ISharePointSearchService extends ISearchService {
    
    /**
     * The SharePoint result source id to target
     */
    resultSourceId?: string;

    /**
     * Indicates wheter or not the query rules should be applied in the query
     */
    enableQueryRules?: boolean;
    
    /**
     * Include OneDrive results
     */
    includeOneDriveResults?: boolean;

}