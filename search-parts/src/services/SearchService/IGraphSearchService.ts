import ISearchService from "./ISearchService";

export interface IGraphSearchService extends ISearchService {
    getEntityTypes():string[];
}