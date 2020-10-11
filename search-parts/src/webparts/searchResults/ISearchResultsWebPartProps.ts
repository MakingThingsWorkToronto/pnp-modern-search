import { DynamicProperty } from '@microsoft/sp-component-base';
import { ICustomTemplateFieldValue } from '../../services/ResultService/ResultService';
import { ISynonymFieldConfiguration} from '../../models/ISynonymFieldConfiguration';
import IQueryModifierConfiguration from '../../models/IQueryModifierConfiguration';
import { IPagingSettings } from '../../models/IPagingSettings';
import { ISearchResultType, ResultsLayoutOption, ICommonSearchProps, ITemplateParameters } from 'search-extensibility';

export interface ISearchResultsWebPartProps extends ICommonSearchProps, ITemplateParameters {

    dynamicKeywords: DynamicProperty<string>;

    /*
    * Eliminate these in version 5, here for backwards compatability to support upgrade scenarios
    *   These are SharePoint specific datasource properties    
    *   They are moved into the searchDataSourceParameters property
    */
    resultSourceId: string;
    enableQueryRules: boolean;
    includeOneDriveResults: boolean;
    
    /*
    * Template and UI properties
    */
    showResultsCount: boolean;
    showBlank: boolean;
    selectedLayout: ResultsLayoutOption;
    externalTemplateUrl: string;
    inlineTemplateText: string;
    webPartTitle: string;
    resultTypes: ISearchResultType[];
    rendererId: string;
    customTemplateFieldValues: ICustomTemplateFieldValue[];
    useRefiners: boolean;
    useSearchVerticals: boolean;
    refinerDataSourceReference: string;
    searchVerticalDataSourceReference: string;
    paginationDataSourceReference: string;
    synonymList: ISynonymFieldConfiguration[];
    queryModifiers: IQueryModifierConfiguration[];
    selectedQueryModifierDisplayName: string;
    refinementFilters: string;
    extensibilityLibraries: string[];
    enableLocalization: boolean;

    /**
     * The Web Part paging settings
     */
    paging: IPagingSettings;

}
