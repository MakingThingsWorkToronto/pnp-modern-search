import { ISearchService } from "search-extensibility";

export interface IGraphContentSource {
    name: string;
}

export interface IGraphSearchService extends ISearchService {
    
    /**
     * Entities that should be included in the search request
     */
    entityTypes:string[];
    
    /**
     * Content source id
     */
    contentSources:IGraphContentSource[];

    /**
     * Enable the top results to be returned
     */
    enableTopResults:boolean;
    
    /**
     * Get the types of entities that are supported
     */
    getEntityTypes():string[];

}