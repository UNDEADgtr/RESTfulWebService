tpl = {

    templatesPattern: {
        'resourcePath': '<li><a href="#{{hrefResourcePath}}">{{ resourcePath }}</a></li>',
        'resources': '<div id="resources"><ul></ul></div>',
        'resourcesTab': '<li><a href="#resource_{{tabName}}">{{tabName}}</a></li>',
        'resourcesContent': '<div id="resource_{{tabName}}"></div>',
        'raw': '<div class="raw"><pre>{{data}}</pre></div>',
        'options': '<div class="options">' +
            '<button onclick="Docs.openCloseOperations(\'{{resource}}\')">Operations</button>' +
            '<button onclick="Docs.openOperationsForResource(\'{{resource}}\')">List Operations</button>' +
            '<button onclick="Docs.closeOperationsForResource(\'{{resource}}\')">Expand Operations</button>' +
            '<button onclick="Docs.openCloseRaw(\'{{resource}}\')">Raw</button>' +
            '</div>',
        'operations': '<div class="operations"></div>',
        'heading': '<h3><div class="heading {{ httpMethod }}"><h3>' +
            '<span class="http_method"><a href="#">{{ httpMethod }}</a></span>' +
            '<span class="path"><a href="#">{{ path }}</a></span>' +
            '<span class="summary"><a href="#">{{ summary }}</a></span>' +
            '</h3></div></h3>',
        'signatureSelect': '<div class="signature-select">' +
            '<a class="description-link selected" href="#" onclick="Docs.showModel(\'{{id}}\')">Model</a>' +
            ' / ' +
            '<a class="snippet-link" href="#" onclick="Docs.showModelSchema(\'{{id}}\')">Model Schema</a>' +
            '</div>',
        'propName': '<span class="propName propOpt">{{propName}}</span>',
        'propType': '<span class="propType">{{propType}}</span>',
        'propOptKey': '<span class="propOptKey">{{propOptKey}}</span>',
        'form': '<form accept-charset="UTF-8" class="sandbox">' +
            '<div style="margin:0;padding:0;display:inline"></div>' +
            '<h4>Parameters</h4>' +
            '<table class="fullwidth">' +
            '<thead>' +
            '<tr>' +
            '<th style="width: 100px; max-width: 100px">Parameter</th>' +
            '<th style="width: 210px; max-width: 210px">Value</th>' +
            '<th style="width: 300px; max-width: 300px">Description</th>' +
            '<th style="width: 100px; max-width: 100px">Parameter Type</th>' +
            '<th style="width: 220px; max-width: 230px">Data Type</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody class="operation-params"></tbody>' +
            '</table>' +
            '<div class="sandbox_header">' +
            //'<input class="submit" name="commit" type="submit" value="Try it out!">' +
            '<input class="submit" name="commit" type="button" value="Try it out!">' +
            '</div>' +
            '</form>',
        'rowTable': '<tr>' +
            '<td class="code required">{{name}}</td>' +
            '<td class="input"><input class="parameter required" minlength="1" name="{{name}}" placeholder="(required)" type="text" value=""></td>' +
            '<td><strong>{{description}}</strong></td>' +
            '<td>{{name}}</td>' +
            '<td>{{dataType}}</td>' +
            '</tr>',
        'responseHider': '<a href="#" class="response_hider" onclick="Docs.hideResponse(\'{{id}}\')">Hide Response</a>',
        'response': '<div class="response">' +
            '<h4>Request URL</h4>' +
            '<div>' +
            '<pre>{{ requestURL }}</pre>' +
            '</div>' +
            '<h4>Response Body</h4>' +
            '<div class="block response_body xml">' +
            '<pre class="json"> {{ responseBody }} </pre>' +
            '</div>' +
            '<h4>Response Code</h4>' +
            '<div class="block response_code">' +
            '<pre>{{ responseCode }}</pre>' +
            '</div>' +
            '<h4>Response Headers</h4>' +
            '<div class="block response_headers">' +
            '<pre>{{ responseHeaders }}</pre>' +
            '</div>' +
            '</div>',
        'footer': '<div class="footer"><br><br>' +
            '<h4>' +
            '[<span>base url: </span>{{ basePath }},<span> api version: </span>{{ apiVersion }}]' +
            '</h4>' +
            '</div>'
    },


    templates: {
    },

    loadTemplates: function (names, callback) {

//        var that = this;
//
//        var loadTemplate = function (index) {
//            var name = names[index];
//            console.log('Loading template: ' + name);
//
//            //$.get('tpl/' + name + '.html', function(data) {
//
//            that.templates[name] = Handlebars.compile($('#' + name).html());
//            index++;
//            if (index < names.length) {
//                loadTemplate(index);
//            } else {
        callback();
//            }
        //            //});
        //        }
        //
        //        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get: function (name) {
        return this.templates[name];
    },
    getResourcePath: function (model) {
        model.hrefResourcePath = 'tab-' + model.resourcePath;
        return Handlebars.compile(this.templatesPattern.resourcePath)(model);
    },
    getResources: function () {
        return Handlebars.compile(this.templatesPattern.resources)();
    },
    getResourcesTab: function (tabName) {
        return Handlebars.compile(this.templatesPattern.resourcesTab)({tabName: tabName});
    },
    getResourcesContent: function (tabName) {
        return Handlebars.compile(this.templatesPattern.resourcesContent)({tabName: tabName});
    },
    getRaw: function (data) {
        return Handlebars.compile(this.templatesPattern.raw)({data: data});
    },
    getOperations: function () {
        return Handlebars.compile(this.templatesPattern.operations)();
    },
    getHeading: function (model) {
        return Handlebars.compile(this.templatesPattern.heading)(model);
    },
    getSignatureSelect: function (id) {
        return Handlebars.compile(this.templatesPattern.signatureSelect)({id: id});
    },
    getPropName: function (propName) {
        return Handlebars.compile(this.templatesPattern.propName)({propName: propName});
    },
    getPropType: function (propType) {
        return Handlebars.compile(this.templatesPattern.propType)({propType: propType});
    },
    getPropOptKey: function (propOptKey) {
        return Handlebars.compile(this.templatesPattern.propOptKey)({propOptKey: propOptKey});
    },
    getForm: function () {
        return Handlebars.compile(this.templatesPattern.form)();
    },
    getRowTable: function (model) {
        return Handlebars.compile(this.templatesPattern.rowTable)(model);
    },
    getResponseHider: function (id) {
        return Handlebars.compile(this.templatesPattern.responseHider)({id: id});
    },
    getResponse: function (model) {
        var model = {};
        model.requestURL = '1';
        model.responseBody = '2';
        model.responseCode = '3';
        model.responseHeaders = '4';

        return Handlebars.compile(this.templatesPattern.response)(model);
    },
    getFooter: function (model) {
        return Handlebars.compile(this.templatesPattern.footer)(model);
    },
    getOptions: function (resource) {
        return Handlebars.compile(this.templatesPattern.options)({resource: resource});
    },


    buildResources: function (id) {
        $("#" + id).tabs();
    },
    buildOperations: function (id) {
        $("." + id).accordion({
            heightStyle: "content",
            autoHeight: true,
            active: false,
            collapsible: true,
            autoHeight: true

        });
    }

};

//App.template = function (id) {
//    return Handlebars.compile($('#' + id).html());
//};


var Docs = {
    openCloseOperations: function (resource) {
        $('div#' + resource + ' div.raw').hide();
        $('div#' + resource + ' div.operations').show();
    },
    openOperationsForResource: function (resource) {
        $('div#' + resource + ' div.operations .ui-accordion-content').show();
    },
    closeOperationsForResource: function (resource) {
        $('div#' + resource + ' div.operations .ui-accordion-content').hide();
    },
    openCloseRaw: function (resource) {
        $('div#' + resource + ' div.operations').hide();
        $('div#' + resource + ' div.raw').show();
    },
    transformResourceName: function (resource) {
        return resource.replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g, "");
    },
    showModel: function (id) {
        $('div#' + id + ' a.snippet-link').removeClass('selected')
        $('div#' + id + ' div.snippet').hide();

        $('div#' + id + ' a.description-link').addClass('selected')
        $('div#' + id + ' div.description').show();
    },
    showModelSchema: function (id) {
        $('div#' + id + ' a.description-link').removeClass('selected')
        $('div#' + id + ' div.description').hide();

        $('div#' + id + ' a.snippet-link').addClass('selected')
        $('div#' + id + ' div.snippet').show();
    },
    hideResponse: function (id) {
        $('div#' + id + ' div.response').hide();
        $('div#' + id + ' a.response_hider').hide();
    }
};




