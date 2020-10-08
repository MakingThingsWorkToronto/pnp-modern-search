import {ISearchParams} from 'search-extensibility';

export interface IGraphSearchParams extends ISearchParams {
    clientType:"MicrosoftGraph";
    pageNumber:number;
}