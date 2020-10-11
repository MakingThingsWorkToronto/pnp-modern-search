import { ISortFieldDirection } from "search-extensibility";

type UpdateSortOperationCallback = (sortDirection: ISortFieldDirection, sortField?: string) => void;

export default UpdateSortOperationCallback;