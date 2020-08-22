// React
import * as React from 'react';

// Localization
import * as strings from 'SearchRefinersWebPartStrings';

// CSS
import styles from './CustomTemplate.module.scss';

// UI Fabric
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Text } from '@microsoft/sp-core-library';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Text as TextUI } from 'office-ui-fabric-react/lib/Text';
import { getFileTypeIconProps } from '@uifabric/file-type-icons';
import { ITheme } from '@uifabric/styling';

// Third party lib
import update from 'immutability-helper';

// Helper
import { FileHelper } from './../../../../../helpers/FileHelper';

// Interface
import { IRefinementValue, RefinementOperator } from 'search-extensibility';
import { IRefinerProps, IRefinerState } from 'search-extensibility';
import { TextField } from 'office-ui-fabric-react';
import { CssHelper } from '../../../../../helpers/CssHelper';


// Class
export default class CustomTemplate extends React.Component<IRefinerProps, IRefinerState> {

  private _operator: RefinementOperator;

  public constructor(props: IRefinerProps) {
    super(props);

    this.state = {
      refinerSelectedFilterValues: []
    };

    this._onValueFilterChanged = this._onValueFilterChanged.bind(this);
    this._isFilterMatch = this._isFilterMatch.bind(this);
    this._clearValueFilter = this._clearValueFilter.bind(this);
  }

  public configureEvents() : void {



  }

  public render() {

    let disableButtons = false;
    if (this.props.selectedValues.length === 0 && this.state.refinerSelectedFilterValues.length === 0) {
        disableButtons = true;
    }
    
    const filterClassName = CssHelper.prefixAndValidateClassName("pnp-refiner-custom", this.props.refinementResult.FilterName);

    /**
     * Events to handle
     * 
     * 
     * 
     */

    return (
      <div className={styles.pnpRefinersCustom + " " + filterClassName}>
        
      </div>
    );
  }

  public componentDidMount() {

    // Determine the operator according to multi value setting
    this._operator = this.props.isMultiValue ? RefinementOperator.OR : RefinementOperator.AND;

    // This scenario happens due to the behavior of the Office UI Fabric GroupedList component who recreates child components when a greoup is collapsed/expanded, causing a state reset for sub components
    // In this case we use the refiners global state to recreate the 'local' state for this component
    this.setState({
      refinerSelectedFilterValues: this.props.selectedValues
    });
  }

  public UNSAFE_componentWillReceiveProps(nextProps: IRefinerProps) {

    if (nextProps.shouldResetFilters) {
      this.setState({
        refinerSelectedFilterValues: []
      });
    }

    // Remove an arbitrary value from the inner state
    // Useful when the remove filter action is also present in the parent layout component
    if (nextProps.removeFilterValue) {

      const newFilterValues = this.state.refinerSelectedFilterValues.filter((elt) => {
        return elt.RefinementValue !== nextProps.removeFilterValue.RefinementValue;
      });

      this.setState({
        refinerSelectedFilterValues: newFilterValues
      });

      this._applyFilters(newFilterValues);
    }
  }

  /**
   * Checks if the current filter value is present in the list of the selected values for the current refiner
   * @param valueToCheck The filter value to check
   */
  private _isValueInFilterSelection(valueToCheck: IRefinementValue): boolean {

    let newFilters = this.state.refinerSelectedFilterValues.filter((filter) => {
      return filter.RefinementToken === valueToCheck.RefinementToken || filter.RefinementValue === valueToCheck.RefinementValue;
    });

    return newFilters.length === 0 ? false : true;
  }

  /**
   * Handler when a new filter value is selected
   * @param addedValue the filter value added
   */
  private _onFilterAdded = (addedValue: IRefinementValue) => {

    let newFilterValues = update(this.state.refinerSelectedFilterValues, { $push: [addedValue] });

    this.setState({
      refinerSelectedFilterValues: newFilterValues
    });

    if (!this.props.isMultiValue) {
      this._applyFilters(newFilterValues);
    }
  }

  /**
   * Handler when a filter value is unselected
   * @param removedValue the filter value removed
   */
  private _onFilterRemoved = (removedValue: IRefinementValue) => {

    const newFilterValues = this.state.refinerSelectedFilterValues.filter((elt) => {
      return elt.RefinementValue !== removedValue.RefinementValue;
    });

    this.setState({
      refinerSelectedFilterValues: newFilterValues
    });

    if (!this.props.isMultiValue) {
      this._applyFilters(newFilterValues);
    }
  }

  /**
   * Applies all selected filters for the current refiner
   */
  private _applyFilters = (updatedValues: IRefinementValue[]) => {
    this.props.onFilterValuesUpdated(this.props.refinementResult.FilterName, updatedValues, this._operator);
  }

  /**
   * Clears all selected filters for the current refiner
   */
  private _clearFilters = () => {

    this.setState({
      refinerSelectedFilterValues: []
    });

    this._applyFilters([]);
  }

  /**
   * Checks if an item-object matches the provided refinement value filter value
   * @param item The item-object to be checked
   */
  private _isFilterMatch(item: IRefinementValue): boolean {
      if(!this.state.valueFilter) { return false; }
      const isSelected = this.state.refinerSelectedFilterValues.some(selectedValue => selectedValue.RefinementValue === item.RefinementValue);
      if(isSelected) { return false; }
      return item.RefinementValue.toLowerCase().indexOf(this.state.valueFilter.toLowerCase()) === -1 ;
  }

  /**
   * Event triggered when a new value is provided in the refinement value filter textfield.
   * @param newvalue The new value provided through the textfield
   */
  private _onValueFilterChanged(newValue: string) {
      this.setState({
          valueFilter: newValue
      });
  }

  /**
   * Clears the filter applied to the refinement values
   */
  private _clearValueFilter() {
      this.setState({
          valueFilter: ""
      });
  }

  /**
   * Prevents the parent group to be colapsed
   * @param event The event that triggered the click
   */
  private _onValueFilterClick(event: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement, MouseEvent>) {
      event.stopPropagation();
  }
}