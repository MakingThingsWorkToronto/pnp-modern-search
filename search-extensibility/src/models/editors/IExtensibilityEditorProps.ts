import { IExtensibilityLibrary } from '../..';
import { Guid } from '@microsoft/sp-core-library';
import { IExtensibilityService } from '../IExtensibilityService';

export interface IExtensibilityEditorProps {
    label: string;
    allowedExtensions: string[];
    libraries: IExtensibilityLibrary[];
    extensibilityService: IExtensibilityService;
    onLibraryAdded: (id:Guid) => Promise<boolean>;
    onLibraryDeleted: (id:Guid) => Promise<boolean>;
}

export interface IExtensibilityEditorPropertyPaneProps extends IExtensibilityEditorProps {
    disabled?: boolean;    
}