import ISearchService from "./ISearchService";

export interface IGraphSearchService extends ISearchService {
    entityTypes:string[];
    getEntityTypes():string[];
}