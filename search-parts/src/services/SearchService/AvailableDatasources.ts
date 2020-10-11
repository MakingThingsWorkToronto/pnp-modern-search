import { IExtension } from "search-extensibility";
import GraphSearchService from "./GraphSearchService";
import SearchService from "./SearchService";

export class AvailableDatasources {

    public static SharePointDatasourceName:string = "sp";
    public static GraphDatasourceName:string = "graph";

    public static BuiltinDatasources: IExtension<any>[] = [
        {
            name: AvailableDatasources.SharePointDatasourceName,
            extensionClass: SearchService,
            displayName: "SharePoint",
            description: "Uses the classic SharePoint Search service.",
            icon: "SharepointLogo"
        },
        {
            name: AvailableDatasources.GraphDatasourceName,
            extensionClass: GraphSearchService,
            displayName: "Microsoft Search",
            description: "Uses the Graph API for Microsoft Search.",
            icon: "WindowsLogo"
        }
    ];

}