//Views

/*
 |---------------------------------------------------
 |  Main
 |---------------------------------------------------
 */

App.Views.HeaderView = Backbone.View.extend({
    initialize: function () {
        this.discoveryUrl = $('#input_baseUrl');
        this.apiKey = $('#input_apiKey');
    },
    el: '#api_selector',
    events: {
        'submit': 'submit'
    },
    submit: function (e) {
        e.preventDefault();
        this.clean();
        this.cleanMessages();
        if (Validation.url(this.discoveryUrl.val())) {
            Message.add('fetching resource list: ' + this.discoveryUrl.val());

            App.URLSettings = new App.Models.URLSettings;
            App.URLSettings.set({
                discoveryUrl: this.discoveryUrl.val(),
                apiKey: this.apiKey.val()
            });

            App.ApiDoc = new App.Models.ApiDoc();
            App.ApiDoc.urlRoot = App.URLSettings.get('discoveryUrl');

            new App.Views.ApiDoc({model: App.ApiDoc})
        } else {
            Message.addError('incorrect url');
        }

    },
    clean: function () {

        if (App.Apis != null) {
            App.Apis.reset();
            App.Apis.modelView.length = 0;
        }
    },
    cleanMessages: function () {
        Message.clean()

    }
});

App.Views.ApiDoc = Backbone.View.extend({
    initialize: function () {
        var thisView = this
        this.model.fetch().done(function () {
            var errors = Validation.apiDocs(thisView.model.toJSON());
            if(!errors){
                App.basePath = App.ApiDoc.get('basePath');
                thisView.render()
            } else {
                Message.addStickerErrorsAsMany(errors);
                Message.addError('Content api-docs is invalid.')
            }
        });
    },
    render: function () {
        App.Apis = new App.Collections.Apis();
        App.Apis.count = App.ApiDoc.get('apis').length;
        App.ApiDoc.get('apis').forEach(function (api) {
            var model = new App.Models.Api({ urlRoot: App.ApiDoc.get('basePath') + api.path });
            var view = new App.Views.Api({ model: model });
            App.Apis.add(model)
            App.Apis.modelView.push(view)
        });
        //console.log(App.Apis.modelView)
    }
});

App.Views.Api = Backbone.View.extend({
    initialize: function () {
        _.bindAll(this, "render");
        this.model.fetch({
            success: this.render
        });
    },
    render: function () {
        App.Apis.count--;
        if (App.Apis.count == 0) {
            App.Apis.count = App.Apis.models.length;
            (new App.Views.UIContainer({collection: App.Apis})).render();
        }
    }
});

App.Views.UIContainer = Backbone.View.extend({
    tagName: 'div',
    render: function () {

        var $el = $(this.el);
        $el.append(tpl.getResources());

        this.collection.each(function (api) {

            var errors = Validation.api(api.toJSON());
            if(errors){
                Message.addStickerErrorsAsMany(errors);
                Message.addError('Content api is invalid.')
                return;
            }


            var path = Docs.transformResourceName(api.get('resourcePath'));

            $el.find('div#resources ul').append(tpl.getResourcesTab(path));
            $el.find('div#resources').append(tpl.getResourcesContent(path));

            path = 'resource_' + path;

            $el.find('div#resources div#' + path).append(tpl.getOptions(path));
            $el.find('div#resources div#' + path).append('<br/>');

            var raw = JSON.stringify(api.toJSON(), "", 3);
            $el.find('div#resources div#' + path).append(tpl.getRaw(raw));

            var operations = new App.Views.Operations({model: api, path: path})

            $el.find('div#resources div#' + path).append(operations.render().el)
            //console.log(api)
        });

        console.log(this.el);

        $('#ui-container').empty();
        $('#ui-container').append(this.el);

        tpl.buildResources('resources')
        tpl.buildOperations('operations');
        tpl.buildDatepicker('datepicker');


        $('#ui-container').append(tpl.getFooter(App.ApiDoc.toJSON()));

        Message.add('fetched resource list: ' + App.basePath);
        return this;
    }
});

App.Views.Operations = Backbone.View.extend({
    tagName: 'div',
    render: function () {
        var $el = $(this.el);

        $el.addClass('operations');

        JsonUtil.models = this.model.get('models');

        //console.log(this.model)

        this.model.get('apis').forEach(function (api) {
            var i = 1;
            api.operations.forEach(function (operation) {
                operation.httpMethod = operation.httpMethod.toLowerCase();
                operation.path = api.path;
                $el.append(tpl.getHeading(operation));

                var operationContent = new App.Views.OperationContent({model: operation})
                $el.append($('<div></div>').append(operationContent.render().el));
            })
        });
        return this;
    }
});


App.Views.OperationContent = Backbone.View.extend({
    tagName: 'div',
    render: function () {

        var $el = $(this.el);
        var id = this.model.httpMethod + '_' + this.model.nickname;
        var model = this.model;

        $el.attr({id: id})
        $el.addClass('content');
        $el.addClass(model.httpMethod);

        if (model.notes) {
            $el.append(tpl.getNotes(model.notes));
        }

        $el.append('<h4>Response Class</h4>');

        var modelSignature = new App.Views.ModelSignature({model: model, idOperation: id});
        $el.append(modelSignature.render().el);

        $el.append('<br/>');

        var form = new App.Views.Form({model: model, idOperation: id});
        $el.append(form.render().el);

        $el.append('<br/>');

        //var response = new App.Views.Response({idOperation: id});
        //$el.append(response.render().el);

        //console.log(this.el)

        return this;
    }
});


App.Views.ModelSignature = Backbone.View.extend({
    tagName: 'div',
    render: function () {
        var $el = $(this.el);
        var id = this.options.idOperation;
        var model = this.model;

        //console.log(model)

        $el.addClass('model-signature');

        $el.append(tpl.getSignatureSelect(id));

        $el.append('<div class="signature-container"></div>');

        var description = new App.Views.Description({model: model});
        $el.find('.signature-container').append(description.render().el);

        var snippet = new App.Views.Snippet({model: model});
        $el.find('.signature-container').append(snippet.render().el);


        if (model.errorResponses) {
            $el.append(tpl.getResponseErrors(id));
            var errors = new App.Views.Errors({model: model});
            $el.find('.response-errors').append(errors.render().el);
        }

        if (model.httpMethod.toLowerCase() == "post" || model.httpMethod.toLowerCase() == "put") {
            $el.append(tpl.getModelObject(id));
            var errors = new App.Views.ModelObject({model: model});
            $el.find('.model-object').append(errors.render().el);
        }

        return this;
    }
});

App.Views.Description = Backbone.View.extend({
    tagName: 'div',
    render: function () {
        var $el = $(this.el);
        var model = this.model;
        var responseClass = this.model.responseClass;

        $el.addClass('description');

        var json = JsonUtil.getClassAsJson(responseClass)

        if (json) {
            var buffer = '';
            var properties = json.properties;

            buffer += '<span class="strong">' + responseClass + ' {</span>';

            for (var name in properties) {
                buffer += '<div>'
                buffer += tpl.getPropName(name);
                buffer += '('
                buffer += tpl.getPropType(properties[name].type);
                buffer += ','
                buffer += tpl.getPropOptKey('optional');
                buffer += '),'
                buffer += '</div>'
            }

            buffer += '<span class="strong">}</span>';

            $el.append(buffer);
        } else {
            $el.append(responseClass);
        }

        return this;
    }
});

App.Views.Snippet = Backbone.View.extend({
    tagName: 'div',
    render: function () {
        var $el = $(this.el);
        var model = this.model;
        var responseClass = model.responseClass;
        $el.addClass('snippet');
        $el.append('<pre></pre>')
        $el.find('pre').append(JsonUtil.getClassAsFormatJsonString(responseClass))
        return this;
    }
});

App.Views.Errors = Backbone.View.extend({
    tagName: 'div',
    render: function () {
        var $el = $(this.el);
        var model = this.model;
        var responseClass = model.responseClass;
        $el.addClass('errors');
        $el.append('<pre></pre>')
        $el.find('pre').append(JSON.stringify(model.errorResponses, '', 3))
        return this;
    }
});

App.Views.ModelObject = Backbone.View.extend({
    tagName: 'div',
    render: function () {
        var $el = $(this.el);
        var model = this.model;

        $el.addClass('objects');
        $el.append('<pre></pre>')

        model.parameters.forEach(function (parameter) {
            var clazz = parameter.dataType;
            $el.find('pre').append('Name: ' + parameter.name + '\n');
            $el.find('pre').append('Class name: ' + clazz + '\n');
            if (clazz.toLowerCase().indexOf('list') == 0) {
                'List[User]'
                clazz = clazz.substring(5, clazz.length - 1)
            }
            $el.find('pre').append('Class value: ' + JsonUtil.getClassAsFormatJsonString(clazz) + '\n' + '\n')
        })
        return this;
    }
});


App.Views.Form = Backbone.View.extend({
    tagName: 'div',
    render: function () {
        var $el = $(this.el);
        var model = this.model;
        var id = this.options.idOperation;
        var parameters = new App.Collections.Parameters();
        parameters.operation = this.model;
        $el.append(tpl.getForm());
        if (model.parameters) {
            model.parameters.forEach(function (parameter) {
                $el.find('tbody').append(tpl.getRowTable(parameter))
                parameters.add(new App.Models.Parameter({
                    name: parameter.name,
                    type: parameter.dataType,
                    classEntity: JsonUtil.getClassAsJson(parameter.dataType),
                    paramType: parameter.paramType
                }));
            });
        }
        $el.find('form').attr({id: id + 'form'})
        new App.Views.FormSubmit({/*model: this.model, */idOperation: id, parameters: parameters});
        return this;
    }
});


App.Views.FormSubmit = Backbone.View.extend({
    initialize: function () {
        this.events = {}
        this.events['click #' + this.options.idOperation + ' form.sandbox input.submit'] = 'submit';
    },
    el: 'body',
    submit: function (e) {
        e.preventDefault();
        var that = this;
        var id = this.options.idOperation;

        var error_free = true;

        (new Array('input', 'select', 'textarea')).forEach(function (element) {
            $('#' + id + ' form.sandbox ' + element + '.required').each(function () {
                $(this).removeClass('error');
                if ($(this).val() == '') {
                    $(this).addClass('error');
                    //$(this).wiggle();
                    error_free = false;
                }
            });
        })

        //console.log(this.options.parameters)

        if (error_free) {
            var isErrors = false;

            if (this.options.parameters) {
                this.options.parameters.forEach(function (parameter) {

                    var name = parameter.get('name');

                    if ($('#' + id + ' form.sandbox input[name=' + Converter.nameToJQueryName(name) + ']').val()) {
                        parameter.set({value: $('#' + id + ' form.sandbox input[name=' + Converter.nameToJQueryName(name) + ']').val()}, {validate: true})
                    } else if ($('#' + id + ' form.sandbox select[name=' + Converter.nameToJQueryName(name) + ']').val()) {
                        parameter.set({value: $('#' + id + ' form.sandbox select[name=' + Converter.nameToJQueryName(name) + ']').val()}, {validate: true})
                    } else if ($('#' + id + ' form.sandbox textarea[name=' + Converter.nameToJQueryName(name) + ']').val()) {
                        try {
                            parameter.set({value: JSON.parse($('#' + id + ' form.sandbox textarea[name=' + Converter.nameToJQueryName(name) + ']').val())}, {validate: true})
                        }
                        catch (e) {
                            Message.addError('Invalid json format. Please, check your entered data!');
                            Message.addStickerError('Invalid json format.<br/>Please, check your entered data');
                            isErrors = true;
                        }
                    }
                    if (parameter.validationError) {
                        if (parameter.validationErrors) {
                            Message.addStickerErrorsAsOne(parameter.validationErrors)
                            isErrors = true;
                        } else {
                            Message.addStickerError(parameter.validationError);
                            isErrors = true;
                        }
                    }
                })

            }
            if (!isErrors) {
                new App.Views.Response({idOperation: id, parameters : this.options.parameters});
            }
        }
    }
})


App.Views.Response = Backbone.View.extend({
    initialize: function () {
        var thisView = this;
        var parameters = this.options.parameters;

        //console.log(parameters)

        var path = '';

        this.model = new App.Models.Response();
        path = App.basePath + parameters.operation.path;

        if (parameters) {
            parameters.forEach(function (parameter) {

                var parameterAsJson = parameter.toJSON();

                if (parameterAsJson.paramType == 'path') {
                    path = path.replace("\{" + parameterAsJson.name + "\}", encodeURIComponent(parameterAsJson.value));
                } else if (parameterAsJson.paramType == 'query') {
                    if (path.indexOf('?') < 0) {
                        path = path + '?' + parameterAsJson.name + '=' + encodeURIComponent(parameterAsJson.value);
                    } else {
                        path = path + '&' + parameterAsJson.name + '=' + encodeURIComponent(parameterAsJson.value);
                    }
                } else if (parameterAsJson.paramType == 'body') {
                    thisView.model.set(parameterAsJson.value);
                } else if (parameterAsJson.paramType == 'header') {

                } else if (parameterAsJson.paramType == 'form') {

                }
            });
        }

        this.model.urlRoot = path;

        this.model.sync(parameters.operation.httpMethod).done(function () {
            thisView.xhr = thisView.model.xhr;
            thisView.render()
        })

//        this.model.fetch({
//            success: function (data, textStatus, jqXHR) {
//                thisView.xhr = jqXHR.xhr;
//                thisView.render()
//            },
//            error: function (data, jqXHR) {
//                thisView.xhr = jqXHR.xhr;
//                thisView.render()
//            }
//        })
    },
    tagName: 'div',
    render: function () {
        var $el = $(this.el);
        var id = this.options.idOperation;
        var model = this.model;
        var xhr = this.xhr;
        var operation = this.options.operation;

        //console.log(xhr)

        var response = {};
        response.requestURL = model.urlRoot;

        if (xhr.getResponseHeader('Content-Type') == 'application/json') {
            response.responseBody = JSON.stringify(model.toJSON(), '', 3);
        } else if (xhr.getResponseHeader('Content-Type') == 'text/plain') {
            response.responseBody = xhr.responseText;
        }

        response.responseCode = xhr.status;
        response.responseHeaders = xhr.getAllResponseHeaders();

        $el.append(tpl.getResponseHider(id));
        $el.append(tpl.getResponse(response));

        $('#' + id + '.content a.response_hider').remove();
        $('#' + id + '.content div.response').remove();

        $('#' + id + '.content').append(this.el);

        return this;
    }
});

App.Views.ResponseClass = Backbone.View.extend({
    tagName: 'div',
    render: function () {


        return this;
    }
});


//App.Views.ApiContent = Backbone.View.extend({
//    tagName: 'div',
//    render: function () {
//        var apiAccordion = new App.Views.ApiAccordion({model: this.model});
//        var mJson = this.model.toJSON();
//        mJson.AccContent = apiAccordion.render().el.innerHTML
//        console.log(mJson)
//        var cont = $(tpl.getContent(mJson));
//        console.log(cont)
//
//        $(this.el).html(cont);
//        console.log(this.el)
//        return this;
//    }
//});


//window.TaskView = Backbone.View.extend({
//
//    tagName: "div", // Not required since 'div' is the default if no el or tagName specified
//
//    initialize: function () {
//        this.template = _.template(tpl.get('task-details'));
//        this.model.bind("change", this.render, this);
//    },
//
//    render: function (eventName) {
//        $(this.el).html(this.template(this.model.toJSON()));
//        return this;
//    },
//
//    events: {
//        "change input": "change",
//        "click .save": "saveTask",
//        "click .delete": "deleteTask"
//    },
//
//    change: function (event) {
//        var target = event.target;
//        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
//        // You could change your model on the spot, like this:
//        // var change = {};
//        // change[target.name] = target.value;
//        // this.model.set(change);
//    },
//
//    saveTask: function () {
//        this.model.set({
//            name: $('#name').val(),
//            grapes: $('#grapes').val(),
//            country: $('#country').val(),
//            region: $('#region').val(),
//            year: $('#year').val(),
//            description: $('#description').val()
//        });
//        if (this.model.isNew()) {
//            var self = this;
//            app.taskList.create(this.model, {
//                success: function () {
//                    app.navigate('tasks/' + self.model.id, false);
//                }
//            });
//        } else {
//            this.model.save();
//        }
//
//        return false;
//    },
//
//    deleteTask: function () {
//        this.model.destroy({
//            success: function () {
//                alert('Task deleted successfully');
//                window.history.back();
//            }
//        });
//        return false;
//    }
//
//});
//

//App.Views.App = Backbone.View.extend({
//    initialize: function () {
//        console.log('start App');
//
//        App.AddUrlSettings = new App.Views.AddUrlSettings({model: App.URLSettings});
//
//        App.ApiDoc = new App.Models.ApiDoc();
//        new App.Views.ApiDoc({model: App.URLSettings});
//
//        //var allTaskView = new App.Views.Tasks({ collection: App.tasks }).render();
//        //$('#allTasks').append(allTaskView.el);
//        //console.log('start');
//    }
//});
//
//function init(){
//
//}
//


//App.Views.AddTask = Backbone.View.extend({
//
//    initialize: function () {
//        this.title = $('#title');
//        this.when = $('#when');
//        this.description = $('#description');
//    },
//
//    el: '#addTask',
//
//    events: {
//        'submit': 'addTask'
//    },
//
//    addTask: function (e) {
//        e.preventDefault();
//
//        var newTask = this.collection.create({
//            title: this.$('#title').val(),
//            when: this.$('#when').val(),
//            description: this.$('#description').val()
//        }, {wait: true});
//
//        this.clearForm();
//
//    },
//    clearForm: function () {
//        this.title.val('');
//        this.when.val('');
//        this.description.val('');
//    }
//});
//

///*
// |---------------------------------------------------
// | Single Task View
// |---------------------------------------------------
// */
//
//App.Views.Task = Backbone.View.extend({
//    tagName: 'tr',
//
//    template: App.template('taskTemplate'),
//
//    render: function () {
//        this.$el.html(this.template(this.model.toJSON()));
//        return this;
//    }
//
//});