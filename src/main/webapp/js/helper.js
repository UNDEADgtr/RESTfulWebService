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


        'content': '<div id="{{hrefResourcePath}}" ><p><br/><br/> {{{ AccContent }}} <br/></p></div>',
        'footer': '<div class="footer"><br><br>' +
            '<h4>' +
            '[<span>base url: </span>{{ basePath }},<span>api version: </span>{{ apiVersion }}]' +
            '</h4></div>'
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


    getContent: function (model) {
        model.hrefResourcePath = 'tab-' + model.resourcePath;
        return Handlebars.compile(this.templatesPattern.content)(model);
    },
    getFooter: function (model) {
        return Handlebars.compile(this.templatesPattern.footer)(model);
    },
    getOptions: function (resource) {
        return Handlebars.compile(this.templatesPattern.options)({resource: resource});
    },

    buildResources: function (id) {
        //$(function () {
        $("#" + id).tabs();
        //});
    },
    buildOperations: function (id) {
        //$(function () {
        $("." + id).accordion({
            heightStyle: "content",
            autoHeight: true,
            active: false,
            collapsible: true,
            autoHeight: true

        });
        //});
    }


}
;

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

        //div[@id='post_createUsersWithArrayInput']/div[@id='post_createUsersWithArrayInput']/div[@class='signature-container']/div[@class='model-signature'][1]



        $('div#' + id + ' div.description').show();
    },
    showModelSchema: function (id) {

        $('div#' + id + ' a.description-link').removeClass('selected')
        $('div#' + id + ' div.description').hide();

        $('div#' + id + ' a.snippet-link').addClass('selected')
        $('div#' + id + ' div.snippet').show();
    }
};



