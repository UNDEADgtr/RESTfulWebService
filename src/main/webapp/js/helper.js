tpl = {

    templatesPattern: {
        'resourcePath': '<li><a href="#{{hrefResourcePath}}">{{ resourcePath }}</a></li>',
        'options': '<div class="options">' +
            '<button onclick="Docs.openCloseOperations(\'{{resource}}\')">Operations</button>' +
            '<button onclick="Docs.openOperationsForResource(\'{{resource}}\')">List Operations</button>' +
            '<button onclick="Docs.closeOperationsForResource(\'{{resource}}\')">Expand Operations</button>' +
            '<button onclick="Docs.openCloseRaw(\'{{resource}}\')">Raw</button>' +
            '</div>',


        'heading': '<h3>' +
            '<span class="http_method" >' +
            '<a href="#" class="toggleOperation">{{ httpMethod }}</a>' +
            '</span>' +
            '<span class="path">' +
            '<a href="#" class="toggleOperation">{{ path }}</a>' +
            '</span>' +
            '< /h3>' +
            '<ul class="options">' +
            '<li>' +
            '<a href="#" class="toggleOperation">{{ summary }}</a>' +
            '</li>' +
            '</ul>',
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
    getContent: function (model) {
        model.hrefResourcePath = 'tab-' + model.resourcePath;
        return Handlebars.compile(this.templatesPattern.content)(model);
    },
    getHeading: function (model) {
        model.hrefResourcePath = 'tab-' + model.resourcePath;
        return Handlebars.compile(this.templatesPattern.heading)(model);
    },
    getFooter: function (model) {
        return Handlebars.compile(this.templatesPattern.footer)(model);
    },
    getOptions: function (options) {
        return Handlebars.compile(this.templatesPattern.options)({options : options});
    },

    buildResources: function (id) {
        $(function () {
            $("#" + id).tabs();
        });
    },
    buildOperations: function (id) {
        $(function () {
            $("." + id).accordion({
                collapsible: true,
                active: true
            });
        });
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
    }
};



