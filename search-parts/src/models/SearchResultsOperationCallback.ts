import { ISearchService, ISearchResults } from 'search-extensibility';

type SearchResultsOperationCallback = (results: ISearchResults, mountingNodeGuid: string, searchService: ISearchService) => Promise<void>;

export default SearchResultsOperationCallback;