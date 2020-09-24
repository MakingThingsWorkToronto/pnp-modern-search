import * as ReactDOM from 'react-dom';
import { camelCase } from '@microsoft/sp-lodash-subset';
import { IReadonlyTheme, ThemeProvider } from '@microsoft/sp-component-base';
import { IExtensionContext, IWebComponentInstance, ExtensionTypes } from "..";
import '@webcomponents/custom-elements/src/native-shim';
import '@webcomponents/custom-elements/custom-elements.min';

export abstract class BaseWebComponent extends HTMLElement implements IWebComponentInstance {
    
    public extensionType : string = ExtensionTypes.WebComponent;
    public context: IExtensionContext;

    public all : { [key: string] : any } = {};

    public _themeVariant: IReadonlyTheme | undefined;

    public abstract connectedCallback();
    
    public disconnectedCallback() {
        ReactDOM.unmountComponentAtNode(this);
    }
    
    /**
     * Transforms web component attributes to camel case propreties to pass in React components
     * (ex: a 'preview-image' HTML attribute becomes 'previewImage' prop, etc.)
     */
    public resolveAttributes(): { [key:string] : any } {
        
        for (let i =0;i < this.attributes.length;i++) {

            if (this.attributes.item(i)) {

                let value = this.attributes.item(i).value; 
                let attr = this.attributes.item(i).name;  

                // Resolve 'data-*' attribute name
                const matches = attr.match(/data-(.+)/);
                if (matches && matches.length === 2) {
                    attr = matches[1];
                }

                // Booleans
                if (/^(true|false)$/i.test(value)) {
                    this.all[camelCase(attr)] = (value === 'true');
                } else {
                    this.all[camelCase(attr)] = value;
                }
                
            }         
        }

        // Added theme variant to be available in components
        this.all.innerHTML = this.innerHTML;
        this.all.styles = this.style;

        return this.all;

    }
}
