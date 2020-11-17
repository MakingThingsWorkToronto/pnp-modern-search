import { ITemplateService } from "../../services/TemplateService/ITemplateService";

interface ITemplateRendererProps {

    instanceId: string;

    /**
     * The template context
     */
    templateContext: any;

    /**
     * The Handlebars raw template content for a single item
     */
    templateContent: string;

    /**
     * A template service instance
     */
    templateService: ITemplateService;
}

export default ITemplateRendererProps;