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
            App.basePath = App.ApiDoc.get('basePath');
            thisView.render()
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

        $el.attr({id: id})
        $el.addClass('content');
        $el.addClass(this.model.httpMethod);

        $el.append('<h4>Response Class</h4>');

        var modelSignature = new App.Views.ModelSignature({model: this.model, idOperation: id});
        $el.append(modelSignature.render().el);

        $el.append('<br/>');

        var form = new App.Views.Form({model: this.model, idOperation: id});
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


App.Views.Form = Backbone.View.extend({
    tagName: 'div',
    render: function () {
        var $el = $(this.el);
        var model = this.model;
        var id = this.options.idOperation;
        var names = new Array();

        $el.append(tpl.getForm());

        if (model.parameters) {
            model.parameters.forEach(function (parameter) {
                $el.find('tbody').append(tpl.getRowTable(parameter))
                names.push(parameter.name);
            });
        }

        $el.find('form').attr({id: id + 'form'})

        new App.Views.FormSubmit({model: this.model, idOperation: id, names: names});
        //new App.Views.FormSubmit();
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
        console.log('submit')
        var that = this;
        var id = this.options.idOperation;
        var model = this.model;

        var error_free = true;

        $('#' + id + ' form.sandbox input.required').each(function () {

            $(this).removeClass('error');
            if ($(this).val() == '') {
                $(this).addClass('error');
                //$(this).wiggle();
                error_free = false;
            }
        });
        console.log(error_free)
        if (error_free) {
            var values = {}
            var isErrors = false;

            if (this.options.names) {
                this.options.names.forEach(function (name) {
                    console.log($('#' + id + ' form.sandbox input[name=' + name + ']').val())
                    if ($('#' + id + ' form.sandbox input[name=' + name + ']').val()) {
                        values[name] = $('#' + id + ' form.sandbox input[name=' + name + ']').val();
                    } else {
                        try {
                            values[name] = JSON.parse($('#' + id + ' form.sandbox textarea[name=' + name + ']').val());
                        }
                        catch (e) {
                            Message.addError('invalid json format');
                            isErrors = true;
                        }
                    }
                })
            }
            if (!isErrors) {
                new App.Views.Response({idOperation: id, operation: model, values: values});
            }
        }
    }
})


App.Views.Response = Backbone.View.extend({
    initialize: function () {
        var thisView = this;
        var operation = this.options.operation;
        var values = this.options.values;

        var path = '';

        this.model = new App.Models.Response();
        path = App.basePath + operation.path;

        if (operation.parameters) {
            operation.parameters.forEach(function (parameter) {
                var value = values[parameter.name]

                if (parameter.paramType == 'path') {
                    path = path.replace("\{" + parameter.name + "\}", value);
                } else if (parameter.paramType == 'query') {
                    if (path.indexOf('?') < 0) {
                        path = path + '?' + parameter.name + '=' + value;
                    } else {
                        path = path + '&' + parameter.name + '=' + value;
                    }
                } else if (parameter.paramType == 'body') {
                    console.log(value)
                    thisView.model.set(value);
                }

            });
        }
        this.model.urlRoot = path;

        console.log(path)
        console.log(this.model)

        var thatModel = this.model

        this.model.sync(operation.httpMethod).done(function () {
            thisView.xhr = thatModel.xhr;
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

        console.log(xhr)

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

//App.Views.ApiAccordion = Backbone.View.extend({
//    tagName: 'div',
//    render: function () {
//
//        var buffer;
//
//        buffer = '<div class="accordion-api">';
//
//        this.model.get('apis').forEach(function (api) {
//            buffer += '<h3>';
//
//            console.log(tpl.getHeading(api));
//
//            buffer += tpl.getHeading(api);
//            buffer += '</h3>';
//
//            buffer += '<div><p>';
//            var accordionContent = new App.Views.AccordionContent({model: api});
//            buffer += accordionContent.render().el.outerHTML;
//            buffer += '</p></div>';
//
//        });
//
//        buffer += '</div>';
//
//        console.log(buffer);
//        $(this.el).html(buffer);
//
//        return this;
//    }
//});


//App.Views.AccordionContent = Backbone.View.extend({
//    tagName: 'div',
//    render: function () {
//
//        console.log(this.model)
//
//
////        var buffer;
////
////
////        this.model.get('apis').forEach(function(api){
////            buffer += '<h3>';
////            buffer += api.path;
////            buffer += '</h3>';
////
////            buffer += '<div><p>';
////            buffer += api.path;
////            buffer += '</p></div>';
////
////        });
////
////        buffer += '</div>';
//
////        console.log(buffer);
////        $(this.el).html(buffer);
//
//        return this;
//    }
//});


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
//
//window.TaskListView = Backbone.View.extend({
//
//    tagName: 'ul',
//
//    initialize: function () {
//        this.model.bind("reset", this.render, this);
//        var self = this;
//        this.model.bind("add", function (task) {
//            $(self.el).append(new TaskListItemView({model: task}).render().el);
//        });
//    },
//
//    render: function (eventName) {
//        _.each(this.model.models, function (task) {
//            $(this.el).append(new TaskListItemView({model: task}).render().el);
//        }, this);
//        return this;
//    }
//});
//
//window.TaskListItemView = Backbone.View.extend({
//
//    tagName: "li",
//
//    initialize: function () {
//        this.template = _.template(tpl.get('task-list-item'));
//        this.model.bind("change", this.render, this);
//        this.model.bind("destroy", this.close, this);
//    },
//
//    render: function (eventName) {
//        $(this.el).html(this.template(this.model.toJSON()));
//        return this;
//    }
//
//});

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
///*
// |---------------------------------------------------
// |  URL Settings
// |---------------------------------------------------
// */
//
//App.Views.AddUrlSettings = Backbone.View.extend({
//    initialize: function () {
//        this.discoveryUrl = $('#input_baseUrl');
//        this.apiKey = $('#input_apiKey');
//
//        console.log('initialize AddUrlSettings');
//        //this.init(null)
//    },
//    el: '#api_selector',
//    events: {
//        'submit': 'init'
//    },
//    init: function (e) {
//        e.preventDefault();
//        this.model.set({
//            discoveryUrl: this.discoveryUrl.val(),
//            apiKey: this.apiKey.val()
//        });
//        console.log(App.URLSettings);
//    },
//    render: function() {
//
//    }
//});

/*
 |---------------------------------------------------
 |  URL Settings
 |---------------------------------------------------
 */
//App.Views.ApiDoc = Backbone.View.extend({
//    el: '#api_selector',
//    events: {
//        'submit': 'init'
//    },
//    init: function (e) {
//        e.preventDefault();
//        App.ApiDoc.urlRoot = this.model.get('discoveryUrl');
//        App.ApiDoc.fetch();
//        console.log(App.ApiDoc);
//
//        var mas = App.ApiDoc.toJSON();
//        console.log(mas);
//    }
//});


//Add task view

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
// |  All Tasks View
// |---------------------------------------------------
// */
//App.Views.Tasks = Backbone.View.extend({
//
//    initialize: function() {
//        this.collection.on('add', this.addOne, this);
//    },
//
//    tagName: 'tbody',
//
//    render: function () {
//        this.collection.each(this.addOne, this);
//
//        return this;
//    },
//
//    addOne: function (task) {
//        var taskView = new App.Views.Task({ model: task });
//        console.log(taskView.render().el);
//        this.$el.append(taskView.render().el);
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