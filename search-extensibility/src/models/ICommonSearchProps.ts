import { ISortableFieldConfiguration, ISortFieldConfiguration } from '..';

export interface ICommonSearchProps {

    // common to all search datasources
    queryKeywords: string;
    queryTemplate: string;
    defaultSearchQuery: string;
    useDefaultSearchQuery: boolean;
    searchQueryLanguage: number;
    selectedProperties: string[];
    sortList: ISortFieldConfiguration[];
    sortableFields: ISortableFieldConfiguration[];

    // new properties to help with dynamic data source
    // will not be optional in v5
    name?:string;
    params?: { [key:string]:any };

}