import UpdateSortOperationCallback from '../../../../models/UpdateSortOperationCallback';
import { ISortableFieldConfiguration, ISortFieldDirection } from 'search-extensibility';

interface ISortPanelProps {
    sortableFieldsConfiguration: ISortableFieldConfiguration[];
    onUpdateSort: UpdateSortOperationCallback;
    sortDirection?:ISortFieldDirection;
    sortField?:string;
}
  
export default ISortPanelProps;