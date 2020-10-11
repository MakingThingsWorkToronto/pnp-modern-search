import { ISortFieldDirection } from "search-extensibility";

interface IFilterPanelState {
    sortField?: string;
    sortDirection: ISortFieldDirection;
}

export default IFilterPanelState;