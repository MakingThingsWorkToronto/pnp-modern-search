
![Search Filters](../images/search-filters-property-pane.png)

### Refiner Options

Setting | Description
-------|----
Refiners | The search managed properties to use as refiners. Make sure these are refinable. With SharePoint Online, you have to reuse the default ones to do so (RefinableStringXX etc.). The order is the same as they will appear in the refinement panel. You can also provide your own custom labels using the following format RefinableString01:"You custom filter label",RefinableString02:"You custom filter label",... This Web Part supports dynamic translation of taxonomy based refiners with few additional configurations in the connected search results Web Part (see above).
Connect to search results Web Part | The search results Web Part to use on the current page to get filters.

### Styling Options

Setting | Description
-------|----
Web Part Title | Shows a title for this Web Part. Set blank if you don't want a title.
Show blank if no result | Shows nothing if there is no filter
Filters layout | Choose the template to use to display filters results.
Styles | Inject CSS styles into the refiner. Only style tags are allowed. All styles are automatically prefixed with the web part instance id.

### Custom CSS using Styles option
CSS classes are generated by parsing input tokens using the following rules: 
--- Whitespace is replaced with the character "-". EX// My Test ... my-test
--- The unicode wide ampersand is removed. EX// My ＆ Test ... my-test 
--- Multiple "-" are replaced with a single "-". EX// My-Test ... my-test
--- Special characters are removed. EX// @Test One! ... test-one
--- The token is converted to lower case. EX// UPPER TEST ... upper-test
Because of these rules, it is possible some filters will have duplicate class names.

#### Class Names
Unique class names are assigned to filters using the following rules where {FilterName}, {FilterValue} and {UserDisplayName} are tokens:

Checkbox container (single/multiselect): pnp-refiner-checkbox-{FilterName}
Checkbox checkbox: pnp-refiner-checkbox pnp-ref-{FilterName}-{FilterValue}
Container Tree container: pnp-refiner-tree-{FilterName}
Container Tree item container: pnp-refiner-tree pnp-ref-{FilterName}-{FilterValue}
Date range container: pnp-refiner-daterange
File type container: pnp-refiner-filetype-{FilterName}
File type checkbox: pnp-refiner-filetype pnp-ref-{FilterName}-{FilterValue}
Fixed Date range container: pnp-refiner-fixeddaterange-{FilterName}
Persona container: pnp-refiner-persona-{FilterName}
Persona item: pnp-refiner-persona pnp-ref-{FilterName}-{UserDisplayName}

#### Working with SharePoint Theme
A `themeVariant` variable is available in the root Handlebars context. It contains all current theme information that can be used in your CSS classes.  Example:

```
<style>
    .example-themePrimary a {
        color: {{@root.themeVariant.palette.themePrimary}};
    }
</style>
``` 

### Templates

##### Persona

The persona template work with technical account name (ex : i:0#.f|membership|pierre.dupond@tenantsharepoint.onmicrosoft.com).
By default, the _"Author"_ managed property returns only the display name (ex : "Pierre Dupont"). 
To get the 'Persona' template work with "Author", you need to map crawled properties `ows_q_USER_Author` to a managed properties `RefinableStringXX`.

All crawled properties `ows_q_USER_\<name>` and managed properties like `People:Manager`,`People:AccountName`,etc. return technical account name.

##### File Type

The _"File Type"_ template is intended to work with the `FileExtension` managed property.

##### Container Tree

The _"Container Tree" template is intended to work with the `ParentLink` managed property. Since this one is not refinable by default, you must map the `ows_ParentUrl` crawled property to a `RefinableStringXX` managed property.
The purpose of this template is to give the ability to navigate trough a folder hierarchy as metadata by parsing the parent link URL segments.

![Container Tree](../images/container_tree_template.png)

### Custom CSS Skin Examples

The following example skins target the owstaxidmetadataalltagsinfo managed property filter. 

#### Changing Text Boxes into Toggle Buttons

![Toggle Button Skin](../images/Filter-ToggleButton-Skin.png)

```
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox { position: relative; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox label > div { display:none; } 
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox label > span { padding-left: 8rem; width: 100%; display: block; white-space: nowrap; padding-top: 0.15rem; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox input { display: none; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox label { display: block; width: 48px; height: 24px; text-indent: -150%; clip: rect(0 0 0 0); color: transparent; user-select: none; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox label::before,
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox label::after { content: ""; display: block; position: absolute; cursor: pointer; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox label::before { width: 100%; height: 100%; background-color: {{@root.themeVariant.palette.themeLight}}; border-radius: 9999em; -webkit-transition: background-color 0.25s ease; transition: background-color 0.25s ease; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox label::after { top: 0; left: 0; width: 24px; height: 24px; border-radius: 50%; background-color: #fff; box-shadow: 0 0 2px {{@root.themeVariant.palette.themePrimary}}; -webkit-transition: left 0.25s ease, background-color 0.25s ease; transition: left 0.25s ease, background-color 0.25s ease; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox.is-checked label::before { background-color:{{@root.themeVariant.palette.themePrimary}}; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox.is-checked label::after { left: 24px; }
```

#### Changing Color For One Specific Toggle Button

See Toggle Button screenshot for demo.

```
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox.pnp-ref-owstaxidmetadataalltagsinfo-0-accounting label::after { background-color: {{@root.themeVariant.palette.neutralDark}}; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox.pnp-ref-owstaxidmetadataalltagsinfo-0-accounting.is-checked label::after { background-color:{{@root.themeVariant.palette.themeLight}}; box-shadow: 0 0 5px {{@root.themeVariant.palette.neutralDark}}; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox.pnp-ref-owstaxidmetadataalltagsinfo-0-accounting.is-checked label::before { background-color:{{@root.themeVariant.palette.themeLight}}; }
```

#### Two Column Grid View of Refiners Using Current Theme

![Grid Skin](../images/Filter-Grid-Skin.png)

```
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo { display: flex; flex-wrap: wrap; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox { flex: 1 0 50%; white-space: nowrap; padding: 0; margin: 0; box-sizing: border-box; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox input,
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox label > div { display: none;}
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox label { width: 100%; margin: 0 1rem 1rem 0; position: relative; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox label > span { display: block; white-space: nowrap; text-align: center; background: {{@root.themeVariant.palette.themeLighterAlt}}; margin: 0; text-overflow: ellipsis; overflow: hidden; width: 100%; max-width: 225px; padding: 1rem; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox label > span:hover { background: {{@root.themeVariant.palette.themeLight}}; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox.is-checked label > span { background: {{@root.themeVariant.palette.themePrimary}}; color: {{@root.themeVariant.palette.themeLighterAlt}}; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox.is-checked label > span:hover { background: {{@root.themeVariant.palette.themeDarker}}; }
.pnp-refiner-checkbox-owstaxidmetadataalltagsinfo .pnp-refiner-checkbox.is-disabled label > span { color: {{@root.themeVariant.palette.neutralDark}}; }
```