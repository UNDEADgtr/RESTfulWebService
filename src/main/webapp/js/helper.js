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
            '<a class="description-link selected" href="#model" onclick="Docs.showModel(\'{{id}}\')">Model</a>' +
            ' / ' +
            '<a class="snippet-link" href="#model" onclick="Docs.showModelSchema(\'{{id}}\')">Model Schema</a>' +
            '</div>',
        'propName': '<span class="propName propOpt">{{propName}}</span>',
        'propType': '<span class="propType">{{propType}}</span>',
        'propOptKey': '<span class="propOptKey">{{propOptKey}}</span>',
        'responseErrors': '<h4>Response Errors</h4>' +
            '<div class="response-errors">' +
            '<a class="errors-link selected" href="#errors" onclick="Docs.showHideError(\'{{id}}\')">Show/Hide</a>' +
            '</div>',
        'modelObject': '<h4>Model object</h4>' +
            '<div class="model-object">' +
            '<a class="object-link selected" href="#model" onclick="Docs.showHideModelObject(\'{{id}}\')">Show/Hide</a>' +
            '</div>',


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
            '<td class="input">{{{input}}}</td>' +
            '<td><strong>{{description}}</strong></td>' +
            '<td>{{paramType}}</td>' +
            '<td>{{dataType}}</td>' +
            '</tr>',
        'inputString': '<input class="parameter{{requiredTrue}}" minlength="1" name="{{name}}" placeholder="{{placeholder}}" type="text" value="{{defaultValue}}">',
        'inputList': '' +
            '<select class="parameter" name="{{name}}" value="{{defaultValue}}">' +
            '{{#each allowableValues.values}}' +
            '<option value="{{this}}">{{this}}</option>' +
            '{{/each}}' +
            '</select>',
        'inputRange': '<input class="parameter{{requiredTrue}}" name="{{name}}" placeholder="{{placeholder}}" type="number" value="{{defaultValue}}" min="{{min}}" max="{{max}}" step="0.1">',
        'inputDate': '<input class="parameter datepicker{{requiredTrue}}" name="{{name}}" type="text" value="{{defaultValue}}" placeholder="{{placeholder}}"/>',
        'inputTextArea': '<textarea class="body-textarea{{requiredTrue}}" name="{{name}}" value="{{defaultValue}}" placeholder="{{placeholder}}" style="margin: 0px; width: 210px; height: 128px;"></textarea>' +
            '<div><span style="float: right">*json format</span></div>',


        'responseHider': '<a href="#" class="response_hider" onclick="Docs.hideResponse(\'{{id}}\')">Hide Response</a>',
        'response': '<div class="response">' +
            '<h4>Request URL</h4>' +
            '<div>' +
            '<pre>{{ requestURL }}</pre>' +
            '</div>' +
            '<h4>Response Body</h4>' +
            '<div class="block response_body xml">' +
            '<pre class="json">{{ responseBody }}</pre>' +
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
    getResponseErrors: function (id) {
        return Handlebars.compile(this.templatesPattern.responseErrors)({id: id});
    },
    getModelObject: function (id) {
        return Handlebars.compile(this.templatesPattern.modelObject)({id: id});
    },
    getForm: function () {
        return Handlebars.compile(this.templatesPattern.form)();
    },
    getRowTable: function (model) {
        //        {
//            "name": "minCorpusCount",
//            "defaultValue": "5",
//            "description": "Minimum corpus frequency for terms",
//            "required": false,
//            "allowableValues": {
//                "max": "Infinity",
//                "min": 0.0,
//                "valueType": "RANGE"
//                "values": ["noun", "adjective", "verb", "adverb", "interjection", "pronoun", "preposition", "abbreviation", "affix", "article", "auxiliary-verb", "conjunction", "definite-article", "family-name", "given-name", "idiom", "imperative", "noun-plural", "noun-posessive", "past-participle", "phrasal-prefix", "proper-noun", "proper-noun-plural", "proper-noun-posessive", "suffix", "verb-intransitive", "verb-transitive"],
//                "valueType": "LIST"
//            },
//            "dataType": "int",
//            "paramType": "query",
//            "allowMultiple": false
//        }


        if (model.required) {
            model.requiredTrue = ' required'
            model.placeholder = '(required)'
        }
        if (!model.name) {
            model.name = model.dataType
        }

        if (!model.allowableValues || !model.allowableValues.valueType) {

            if (model.paramType == 'body') {
                model.input = this.getInputTextArea(model)
            } else {
                model.input = this.getInputString(model)
            }


        } else if (model.allowableValues.valueType == 'LIST') {
            model.input = this.getInputList(model)
        } else if (model.allowableValues.valueType == 'RANGE') {
            model.input = this.getInputRange(model)
        } else if (model.allowableValues.valueType == 'DATE') {
            model.input = this.getInputDate(model)
        }

        return Handlebars.compile(this.templatesPattern.rowTable)(model);
    },
    getInputString: function (model) {
        return Handlebars.compile(this.templatesPattern.inputString)(model);
    },
    getInputList: function (model) {
        return Handlebars.compile(this.templatesPattern.inputList)(model);
    },
    getInputRange: function (model) {
        return Handlebars.compile(this.templatesPattern.inputRange)(model);
    },
    getInputDate: function (model) {
        return Handlebars.compile(this.templatesPattern.inputDate)(model);
    },
    getInputTextArea: function (model) {
        return Handlebars.compile(this.templatesPattern.inputTextArea)(model);
    },

    getResponseHider: function (id) {
        return Handlebars.compile(this.templatesPattern.responseHider)({id: id});
    },
    getResponse: function (model) {
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
    },
    buildDatepicker: function (id) {
        $("." + id).datepicker({
            dateFormat: 'yy-mm-dd'
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
    showHideError: function (id) {
        $('div#' + id + ' a.errors-link').toggleClass('selected')
        $('div#' + id + ' div.errors').toggle();
    },
    showHideModelObject: function (id) {
        $('div#' + id + ' a.object-link').toggleClass('selected')
        $('div#' + id + ' div.objects').toggle();
    },
    hideResponse: function (id) {
        $('div#' + id + ' div.response').hide();
        $('div#' + id + ' a.response_hider').hide();
    }
};


(function ($) {
    $.sticker = function (o) {
        var o = $.extend({
            time: 5000,
            speed: 'slow',
            note: null,
            className: null,
            position: {top: 0, right: 0}
        }, o);
        var stickers = $('#jquery-stickers');
        if (!stickers.length) {
            $('body').prepend('<div id="jquery-stickers"></div>');
            var stickers = $('#jquery-stickers');
        }
        stickers.css('position', 'fixed').css({right: 'auto', left: 'auto', top: 'auto', bottom: 'auto'}).css(o.position);
        var stick = $('<div class="stick"></div>');
        stickers.append(stick);
        if (o.className) stick.addClass(o.className);
        stick.html(o.note);
        setTimeout(function () {
            stick.fadeOut(o.speed, function () {
                $(this).remove();
            });
        }, o.time);

    };
})(jQuery);

//$.sticker({note:'Проба',className:'stick-classic'});
//$.sticker({note:'Это ошибка.',className:'stick-error'});
