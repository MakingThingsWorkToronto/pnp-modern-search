import { ISearchResults, ISearchVerticalInformation, ISearchParams, IExtensionInstance } from '..';
import { ISearchServiceConfiguration } from './ISearchServiceConfiguration';
import { ISearchVertical } from './ISearchVertical';
import { ISearchContext, IManagedPropertyInfo } from '..';
import { ITemplateService } from './ITemplateService';
import { IPropertyPaneGroup } from "@microsoft/sp-property-pane";
import { ICommonSearchProps } from './ICommonSearchProps';
import { ISearchServiceInitializer } from './ISearchServiceInitializer';

export interface ISearchService extends ISearchServiceConfiguration, ISearchContext, IExtensionInstance {

    useOldIcons : boolean;

    /**
     * Initialize the search service
     * @param config the intializer configuration to setup the service
     */
    init(config: ISearchServiceInitializer) : Promise<void>;

    /**
     * Perfoms a search query.
     * @param query ISearchResults object. Use the 'RelevantResults' property to acces results proeprties (returned as key/value pair object => item.[<Managed property name>])
     */
    search(searchParams:ISearchParams) : Promise<ISearchResults>;

    /**
     * Retrieves search query suggestions
     * @param query the term to suggest from
     */
    suggest(query: string): Promise<string[]>;

    /**
     * Retrieve the configuration of the search service
     */
    getConfiguration(): ISearchServiceConfiguration;

    /**
     * Gets available search managed properties in the search schema
     */
    getAvailableManagedProperties(): Promise<IManagedPropertyInfo[]>;

    /**
     * Checks if the provided manage property is sortable or not
     * @param property the managed property to verify
     */
    validateSortableProperty(property: string): Promise<boolean>;

    /**
     * Retreives the result counts for each search vertical
     * @param queryText the search query text
     * @param searchVerticalsConfiguration the search verticals configuration
     * @param enableQueryRules enable query rules or not
     */
    getSearchVerticalCounts(queryText: string, searchVerticals: ISearchVertical[]): Promise<ISearchVerticalInformation[]>;

    /**
     * Gets all available languages for the search query
     */
    getAvailableQueryLanguages(): Promise<any[]>;

    /**
     * Initializes the property pane for the search service
     */
    getPropertyPane(props: ICommonSearchProps) : IPropertyPaneGroup;
    
    /**
     * Return unique hash for the current search service
     */
    getHashKey() : string;
    
}