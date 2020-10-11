import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PageContext } from '@microsoft/sp-page-context';
import { SPHttpClient } from '@microsoft/sp-http';
import { ITemplateService, ITokenService, ICommonSearchProps } from '..';

export interface ISearchServiceInitializer {
    webPartContext: WebPartContext;
    templateService: ITemplateService;
    tokenService: ITokenService;
    config: ICommonSearchProps;
}