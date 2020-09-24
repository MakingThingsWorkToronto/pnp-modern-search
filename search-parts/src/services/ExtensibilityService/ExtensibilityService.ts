import { SPComponentLoader } from "@microsoft/sp-loader";
import Logger from "../LogService/LogService";
import { IEditorLibrary, IExtensibilityService, IExtensionInstance, ExtensionTypes, ExtensionHelper, IExtension, IExtensibilityLibrary } from 'search-extensibility';
import { Guid } from '@microsoft/sp-core-library';

const LogSource = "[MSWP.ExtensibilityService.";
const EDITOR_LIBRARY_ID = "b4c35af5-102d-4a2d-a448-4b25a7e66a94";

export class ExtensibilityServiceLoader {
    public static get() : IExtensibilityService {
        Logger.write("[MSWP.ExtensibilityServiceLoader.get()]: Getting Extensibility Service.");
        if(!(window as any)._MSWPExtensibilityService) {
            Logger.write("[MSWP.ExtensibilityServiceLoader.get()]: Creating New Extensibility Service.");
            (window as any)._MSWPExtensibilityService = new ExtensibilityService();
        }
        return (window as any)._MSWPExtensibilityService;
    }
}

export class ExtensibilityService implements IExtensibilityService {

    private _loadingLibraries: Map<Guid,boolean>;
    private _loadedLibraries: Map<Guid,IExtensibilityLibrary>; 
    private _validators = new Map<string, (extensionClass:any) => boolean>();

    constructor() {
        
        this._validators[ExtensionTypes.WebComponent] = ExtensionHelper.IsWebComponent;
        this._validators[ExtensionTypes.QueryModifer] = ExtensionHelper.IsQueryModifier;
        this._validators[ExtensionTypes.SuggestionProvider] = ExtensionHelper.IsSuggestionProvider;
        this._validators[ExtensionTypes.HandlebarsHelper] = ExtensionHelper.IsHandlebarsHelper;
        this._validators[ExtensionTypes.Refiner] = ExtensionHelper.IsRefiner;
        this._loadedLibraries = new Map<Guid,IExtensibilityLibrary>();
        this._loadingLibraries = new Map<Guid, boolean>();

    }

    /**
     * Tries to loads the extensibility library component specified by id parameter (GUID)
     */
    public async tryLoadExtensibilityLibrary(id: Guid): Promise<IExtensibilityLibrary> {

        let library: any = undefined;

        try {

            const libraryComponent = await this.tryLoadLibrary(id);

            // Parse the library component properties to instanciate the library itself. 
            // This way, we are not depending on a naming convention for the entry point name. We depend only on the component ID
            const libraryMainEntryPoints = Object.keys(libraryComponent).filter(property => {
                // Return the library main entry point object by checking the prototype methods. They should be matching the IExtensibilityLibrary interface.
                return property.indexOf('__') === -1 && libraryComponent[property].prototype.getExtensions;
            });

            if (libraryMainEntryPoints.length === 1) {
                Logger.write(LogSource + `tryLoadExtensibilityLibrary()]: Library has getExtensions() method: ${id.toString()}`);
                library = new libraryComponent[libraryMainEntryPoints[0]]();
                library.guid = id;
            } else {
                Logger.write(LogSource + `tryLoadExtensibilityLibrary()]: Library has no getExtensions() method, returning null: ${id.toString()}`);
            }

            return library as IExtensibilityLibrary;

        } catch (error) {
            const msg = `tryLoadExtensibilityLibrary()]: Error loading extensibility library: ${id.toString()}. Details: ${error}`;
            Logger.write(LogSource + msg);
            Logger.error(error);
            return null;
            
        }
    }

    /**
     * Load a component library
     * @param id: The guid of the library to load
     */
    private async tryLoadLibrary(id: Guid) : Promise<any> {
        Logger.write(LogSource + `tryLoadLibrary()]: Loading extensibility library: ${id.toString()}`);
        const libraryComponent: any = await SPComponentLoader.loadComponentById(id.toString());
        Logger.write(LogSource + `tryLoadLibrary()]: Library loaded: ${id.toString()}`);
        return libraryComponent;
    }


    /**
     * Loads extensibility libraries specified by users
     */
    public async loadExtensibilityLibraries(libraries:Guid[]) : Promise<IExtensibilityLibrary[]> {

        if(libraries && libraries.length > 0) {

            let allLibraries : IExtensibilityLibrary[] = [];

            for(let i = 0; i < libraries.length; i++) {
                
                const guid = libraries[i];

                if(this._loadingLibraries.has(guid)) {

                    await new Promise((resolve,reject)=>{
                         
                        const interval = setInterval(()=>{

                            if(!this._loadingLibraries.has(guid)) {
                                clearInterval(interval);
                                resolve();
                            }

                        }, 10);

                    });

                } 

                if(this._loadedLibraries.has(guid)) {
                    
                    allLibraries.push(this._loadedLibraries.get(guid));

                } else {
                    
                    this._loadingLibraries.set(guid, true);
                    const library = await this.tryLoadExtensibilityLibrary(libraries[i]);
                    this._loadingLibraries.delete(guid);         

                    if(library != null) {
                        this._loadedLibraries.set(guid, library);
                        allLibraries.push(library);
                    }
                    
                }

            }

            return allLibraries;

        }

        return [];

    }

    public getAllLoadedLibraries() : IExtensibilityLibrary[] {
        const libs : IExtensibilityLibrary[] = [];
        this._loadedLibraries.forEach((library:IExtensibilityLibrary, key:Guid)=>{
            libs.push(library);
        });
        return libs;
    }


    public getExtensions(library: IExtensibilityLibrary) : IExtension<any>[] {

        let extensions: IExtension<any>[] = [];
        
        if(typeof library.getExtensions === "function") {

            const libraryExtensions = this.tryGetExtensions(library);

            if(libraryExtensions && libraryExtensions.length > 0) {

                libraryExtensions.forEach((testExtension) => {

                    if(typeof testExtension.extensionClass != undefined) {
                        extensions.push(testExtension as IExtension<any>);
                    }

                });

            }

        }

        return extensions;

    }

    private tryGetExtensions(library: IExtensibilityLibrary) : IExtension<any>[] {
        let extensions: IExtension<any>[] = null;
        try {
            extensions = library.getExtensions();
        } catch(e) {
            const msg: string = `tryGetExtensions()]: Failure getting extensions from library: ${library.name}. Details: ${e}`;
            Logger.write(msg);
            Logger.error(e);
        }
        return extensions;
    }

    public getAllExtensions(libraries: IExtensibilityLibrary[]) : IExtension<any>[] {

        let extensions : IExtension<any>[] = [];

        for(let i = 0; i < libraries.length; i++){
            const library : IExtensibilityLibrary = libraries[i];
            let extension = this.getExtensions(library);
            extensions = extensions.concat(extension);
        }

        return extensions;

    }

    public filter<T extends IExtensionInstance>(lookIn: IExtension<any>[], extensionType: string) : IExtension<T>[] {

        const validator = this._validators[extensionType];

        if(validator) {
            return lookIn.filter((value)=> validator(value.extensionClass));
        }

        return [];
        
    }

    public async getEditorLibrary() : Promise<IEditorLibrary> {

        let library: any = undefined;
        const editLibrary = await this.tryLoadLibrary(Guid.parse(EDITOR_LIBRARY_ID));
        const libraryMainEntryPoints = Object.keys(editLibrary).filter(property => {
            // Return the library main entry point object by checking the prototype methods. They should be matching the IEditorLibrary interface.
            return property.indexOf('__') === -1 
                && editLibrary[property].prototype.getExtensibilityEditor
                && editLibrary[property].prototype.getRefinersEditor
                && editLibrary[property].prototype.getSearchManagedPropertiesEditor
                && editLibrary[property].prototype.getPropertyPaneSearchManagedProperties
                && editLibrary[property].prototype.getTemplateValueFieldEditor;
        });

        if (libraryMainEntryPoints.length === 1) {
            Logger.write(LogSource + `getEditorLibrary()]: Library loaded, creating instance!`);
            library = new editLibrary[libraryMainEntryPoints[0]]();
        } else {
            Logger.write(LogSource + `getEditorLibrary()]: Cannot find edit library entry point!`);
        }

        return library as IEditorLibrary;

    }


}