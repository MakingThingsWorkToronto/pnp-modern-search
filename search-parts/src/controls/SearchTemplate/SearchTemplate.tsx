import * as React from 'react';
import ISearchTemplateState from './ISearchTemplateState';
import ISearchTemplateProps from './ISearchTemplateProps';
import * as DOMPurify from 'dompurify';
import { CssHelper } from '../../helpers/CssHelper';
import { LogLevel } from '@pnp/logging';
import Logger from '../../services/LogService/LogService';

const TEMPLATE_ID_PREFIX = 'pnp-modern-search-template_';

export default class SearchTemplate<DataContext extends object> extends React.Component<ISearchTemplateProps<DataContext>, ISearchTemplateState> {

    private _domPurify: any;
    private _lastProcessedTemplate: string;
    private _lastTemplate:string;

    constructor(props: ISearchTemplateProps<DataContext>) {
        super(props);
        
        Logger.write("[MSWP.SearchTemplate.constructor()]: " + props.instanceId + "-------------------------------------------------------------");

        this.state = {
            processedTemplate: null
        };

        this._domPurify = DOMPurify.default;

        this._domPurify.setConfig({
            ADD_TAGS: ['style'],
            ADD_ATTR: ['onerror', 'target', 'loading'],
            ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx|ms-\w+):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
            WHOLE_DOCUMENT: true
        });

        let customTags = [];
        // Allow custom elements (ex: my-component)
        this._domPurify.addHook('uponSanitizeElement', (node, data) => {
            if (node.nodeName && node.nodeName.match(/^\w+((-\w+)+)+$/)
                && !data.allowedTags[data.tagName]) {
                data.allowedTags[data.tagName] = true;                
                customTags.push(data.tagName.toLocaleUpperCase());
            }
        });

        
        // Allow all custom attributes on custom elements - except javascript events ones starting with "on"
        // Ideally we'd support only data- ones, but we know other web components don't follow this pattern
        this._domPurify.addHook('uponSanitizeAttribute', (attr, data) => {
            if (data && data.attrName && customTags.indexOf(attr.tagName) !== -1) {
                if(data.attrName.indexOf("on") == 0) return;
                data.allowedAttributes[data.attrName] = true;
            }
        });        

    }

    public render() {

        if(this.state.processedTemplate) {

            const objectNode: any = document.querySelector("object[data='about:blank']");
            if (objectNode) {
                objectNode.style.display = "none";
            }
            
            Logger.write('[MSWP.SearchTemplate.render()]: rendering search template: ' + this.props.instanceId);
            this._lastProcessedTemplate = this._domPurify.sanitize(this.state.processedTemplate);

            return <div key={JSON.stringify(this.props.templateContext)} dangerouslySetInnerHTML={{ __html: this._lastProcessedTemplate }}></div>;

        } else {
            return null;
        }

    }

    public componentDidCatch(error, info) {
        Logger.error(error);
        Logger.write('[MSWP.SearchTemplate.componentDidCatch()]: ' + error.toString());
    }

    public async componentDidMount() : Promise<void> {
        Logger.write('[MSWP.SearchTemplate.componentDidMount()]: component did mount.');
        await this._updateTemplate(this.props);
    }

    public componentDidUpdate() : void {
        // Post render operations (previews on elements, etc.)
        Logger.write('[MSWP.SearchTemplate.componentDidUpdate()]: component did update.');
        this.props.templateService.initPreviewElements();
    }

    public async UNSAFE_componentWillReceiveProps(nextProps: ISearchTemplateProps<DataContext>) {
        Logger.write('[MSWP.SearchTemplate.UNSAFE_componentWillReceiveProps()]: updating template again.');
        await this._updateTemplate(nextProps);
    }

    private async _updateTemplate(props: ISearchTemplateProps<DataContext>): Promise<void> {

        let templateContent = props.templateContent;

        // Process the Handlebars template
        let template = "";
        
        if(this._lastTemplate === templateContent) {
            
            template = this._lastTemplate;
            Logger.write('[MSWP.SearchTemplate._updateTemplate()]: set to same template content.', LogLevel.Info);

        } else {
            
            template = await this.props.templateService.processTemplate(props.templateContext, templateContent);
            this._lastTemplate = template;
            Logger.write('[MSWP.SearchTemplate._updateTemplate()]: reprocessed template.', LogLevel.Info);

        }
        
        if (template) {

            // Sanitize the template HTML           
            const templateAsHtml = new DOMParser().parseFromString(template, "text/html");
            template = CssHelper.prefixStyleElements(templateAsHtml, `${TEMPLATE_ID_PREFIX}${this.props.instanceId}`);
            template = this._domPurify.sanitize(`${template}`);

        }
        
        if(this._lastProcessedTemplate != template) {
            
            Logger.write('[MSWP.SearchTemplate._updateTemplate()]: changes to processed template performing rerender.', LogLevel.Info);

            this.setState({
                processedTemplate: template
            });

        } else {

            Logger.write('[MSWP.SearchTemplate._updateTemplate()]: no changes to processed template, not rerendering.', LogLevel.Info);

        }

    }

}
