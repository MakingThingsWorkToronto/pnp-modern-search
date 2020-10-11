import { ISearchResultType, IExtension, ITemplateParameters, ResultsLayoutOption } from '..';
import { IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';
import { IPropertyPaneField } from '@microsoft/sp-property-pane';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { ISearchService } from './ISearchService';

export interface ITemplateService {
    Handlebars: any;
    Moment: any;
    searchService:ISearchService;
    init():void;
    getTemplateParameters(layout: ResultsLayoutOption, properties: ITemplateParameters, onUpdateAvailableProperties?: (properties: IComboBoxOption[]) => void, availableProperties?: IComboBoxOption[]): IPropertyPaneField<any>[];
    getTemplateDefaultContent(layout: ResultsLayoutOption): string;
    getTemplateContent(templateHtml: string, templateFilePath: string) : Promise<string>;
    getDefaultResultTypeListItem(): string;
    getDefaultResultTypeTileItem(): string;
    getDefaultResultTypeCustomItem(): string;
    getTemplateMarkup(templateContent: string): string;
    getPlaceholderMarkup(templateContent: string): string;
    registerHelpers(helpers: IExtension<any>[])  : void;
    registerWebComponents(webComponents: IExtension<any>[]) : void;
    optimizeLoadingForTemplate(templateContent: string): Promise<void>;
    processTemplate(templateContext: any, templateContent: string): Promise<string>;
    processFieldsConfiguration<T>(fieldsConfigurationAsString: string, itemAsString: string, themeVariant?: IReadonlyTheme): T;
    registerResultTypes(resultTypes: ISearchResultType[], instanceId: string): Promise<void>;
    isValidTemplateFile(filePath: string): Promise<string>;
    initPreviewElements(): void;  
    getFileContent(fileUrl: string): Promise<string>;
    loadHandlebarsHelpers() : Promise<void>;
    loadVideoLibrary() : Promise<void>;
    loadUIFabricIcons() : void;    
}