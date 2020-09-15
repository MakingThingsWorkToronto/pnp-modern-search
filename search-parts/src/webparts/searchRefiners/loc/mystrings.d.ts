declare interface ISearchRefinersWebPartStrings {
    RefinersConfigurationGroupName: string;
    ShowBlankLabel: string;
    StylingSettingsGroupName: string;
    WebPartTitle: string;
    AppliedRefinersLabel: string;
    PlaceHolderEditLabel: string;
    PlaceHolderConfigureBtnLabel: string;
    PlaceHolderIconText: string;
    PlaceHolderDescription: string;
    NoFilterConfiguredLabel: string;
    RemoveAllFiltersLabel: string;
    ShowBlankEditInfoMessage: string;
    RefinersConfiguration: string;
    SearchResultsLabel: string;
    SearchQueryLabel: string;
    FilterPanelTitle: string;
    FilterResultsButtonLabel: string;
    RefinerLayoutLabel: string;
    ConnectToSearchResultsLabel: string;
    DialogButtonLabel: string;
    Refiners: {
        RefinersFieldLabel: string;
        RefinersFieldDescription: string;
        RefinerManagedPropertyField: string;
        EditRefinersLabel: string;
        EditSortLabel: string;
        ApplyFiltersLabel: string;
        ClearFiltersLabel: string;
        ShowExpanded: string;
        showValueFilter: string;
        Templates: {
            DateFromLabel: string;
            DateTolabel: string;
            DatePickerStrings: {
                months: string[],
                shortMonths: string[],
                days: string[],
                shortDays: string[],
                goToToday: string,
                prevMonthAriaLabel: string,
                nextMonthAriaLabel: string,
                prevYearAriaLabel: string,
                nextYearAriaLabel: string,
                closeButtonAriaLabel: string,
                isRequiredErrorMessage: string,
                invalidInputErrorMessage: string
            };
            DateIntervalStrings: {
                AnyTime: string;
                PastDay: string;
                PastWeek: string;
                PastMonth: string;
                Past3Months: string;
                PastYear: string;
                Older: string;
            },
            Custom: {
                ItemTemplateLabel: string;
                EditLabel: string;
            },
        }
    },
    Extensibility: {
        ButtonLabel: string;
        GroupName: string;
    }
}

declare module 'SearchRefinersWebPartStrings' {
    const strings: ISearchRefinersWebPartStrings;
    export = strings;
}
