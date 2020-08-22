define([], function() {
  return {
    "ExtensibilityEditor" : {
      "PanelTitle":"Manage Third Party Extensibility Libraries",
      "PropertyPaneDescription": "Description",
      "BasicGroupName": "Group Name",
      "DescriptionFieldLabel": "Description Field",
      "Delete": "Delete",
      "NoExtensions": "No extensions in this library",
      "DisplayNameLabel": "Display Name",
      "IconLabel": "Icon",
      "NameLabel": "Name",
      "DescLabel": "Description",
      "AddPlaceholder": "Enter extensibility library GUID ...",
      "NoLibrariesAdded": "It's quiet in here. Enter the library manifest GUID to load third party extensibility.",
      "AddLibraryLabel": "Load Library",
      "EnterValidGuid": "Please enter a valid guid :).",
      "LibraryCouldNotBeLoaded": "The library could not be loaded. Please make sure the package is uploaded and the library GUID matches the value entered.",
      "LibraryHasNoExtensions": "The library was loaded successfully but contains no extensions. Please review the getExtensions method in the library you are trying to load.",
      "WebComponentLabel":"Web Component",
      "QueryModifierLabel":"Query Modifier",
      "SuggestionProviderLabel":"Suggestion Provider",
      "HandlebarsHelperLabel":"Handlebars Helper",
      "LibraryDescription":"Description: ",
      "LibraryGuid":"GUID: ",
      "LibraryAlreadyLoaded": "This library is already loaded. Please try another GUID :)."
    },
    "RefinementEditor" : {
      "CodeHeaderText": "Edit Refiner Template",
      "HeaderText": "Edit Refiners",
      "ApplyButtonLabel" : "Apply",
      "CancelButtonLabel": "Cancel",
      "ExportButtonLabel": "Export",
      "ImportButtonLabel": "ImportButtonLabel",
      "JsonFileRequiredMessage": "Please upload a json file",
      "ManagedPropertiesListPlaceHolder": "Select or add a managed property",

      "SaveButtonLabel": "Save",
      "EditHandlebarsExpressionLabel": "Edit Handlebars expression",
      "AddHandlebarsExpressionDialogLabel": "Add Handlebars expression",
      "AvailableRefinersLabel": "Available refiners",      
      "RefinerDisplayValueField": "Filter name to display",      
      "RefinerTemplateField": "Refiner template",
      
      "Templates": {
        "RefinerSortTypeSortDirectionAscending": "Ascending",
        "RefinerSortTypeSortDirectionDescending": "Descending",
        "RefinerSortTypeLabel": "Refiner sort type",
        "RefinerSortTypeAlphabetical": "Alphabetical",
        "RefinerSortTypeByNumberOfResults": "By number of results",
        "RefinerSortTypeSortOrderLabel": "Sort order",
        "RefinementItemTemplateLabel": "Default refinement item",
        "MutliValueRefinementItemTemplateLabel": "Multi-value refinement item",
        "PersonaRefinementItemLabel": "Persona",
        "DateRangeRefinementItemLabel": "Date range",
        "FixedDateRangeRefinementItemLabel": "Date range (fixed intervals)",
        "FileTypeRefinementItemTemplateLabel": "File type",
        "FileTypeMutliValueRefinementItemTemplateLabel": "Multiple file type",
        "ContainerTreeRefinementItemTemplateLabel": "Container Tree",
        "CustomItemTemplateLabel": "Custom Template",
        "CustomEditLabel": "Edit Template",
        "CustomEditRefinerTemplate": "Edit Refiner Template"
      },
      "Sort": {
        "SortInvalidSortableFieldMessage": "This property is not sortable"
      }
    }
  }
});