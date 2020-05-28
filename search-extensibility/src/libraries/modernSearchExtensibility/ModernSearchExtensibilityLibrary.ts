import { IExtensibilityLibrary } from "../../models/IExtensibilityLibrary";
import { IExtension } from '../../models/IExtension';
import { Guid } from '@microsoft/sp-core-library';

export abstract class ModernSearchExtensibilityLibrary implements IExtensibilityLibrary {

  public guid: Guid;

  public abstract icon: string;
  
  public abstract name: string;

  public abstract description: string;

  public abstract getExtensions() : IExtension<any>[];

}