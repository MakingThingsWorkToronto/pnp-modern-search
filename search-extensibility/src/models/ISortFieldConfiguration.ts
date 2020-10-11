export interface ISortFieldConfiguration {
    sortField: string;
    sortDirection: ISortFieldDirection;
}

export interface ISortableFieldConfiguration extends ISortFieldConfiguration {
    displayValue: string;
}

export enum ISortFieldDirection {
    Ascending = 1,
    Descending= 2    
}