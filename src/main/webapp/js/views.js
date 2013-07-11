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
        App.URLSettings = new App.Models.URLSettings;
        App.URLSettings.set({
            discoveryUrl: this.discoveryUrl.val(),
            apiKey: this.apiKey.val()
        });

        App.ApiDoc = new App.Models.ApiDoc();
        App.ApiDoc.urlRoot = App.URLSettings.get('discoveryUrl');

        new App.Views.ApiDoc({model: App.ApiDoc})
    },
    clean: function () {

        if (App.Apis != null) {
            App.Apis.reset();
            App.Apis.modelView.length = 0;
        }
    }
});

App.Views.ApiDoc = Backbone.View.extend({
    initialize: function () {
        var thisView = this
        this.model.fetch().done(function () {
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
        console.log(App.Apis.modelView)
    }
});

App.Views.Api = Backbone.View.extend({
    initialize: function () {
        _.bindAll(this, "render");
        this.model.fetch({
            success: this.render
        });
    },
    resourcePath: '',
    content: '',
    render: function () {

        this.resourcePath = tpl.getResourcePath(this.model.toJSON());
        this.content = tpl.getContent(this.model.toJSON());


        App.Apis.count--;

        if (App.Apis.count == 0) {
            App.Apis.count = App.Apis.models.length;
            (new App.Views.UIContainer({collection: App.Apis})).render();
        }


    }
});

App.Views.UIContainer = Backbone.View.extend({
    initialize: function () {
        //this.collection.on('add', this.addOne, this);
        //this.render();
    },

    tagName: 'div',

//    render: function () {
//        this.$el.empty();
//        this.collection.each(this.addOne, this);
//        console.log(this.el);
//        return this;
//    },
//    addOne: function (task) {
//
//        console.log(task.toJSON())
//        var taskView = new App.Views.Task({ model: task });
//
//        this.$el.append(taskView.render().el);
//    }

    render: function () {

        console.log('UIContainer');

        var buffer;

        buffer = '<div id="verticalTab">';

        buffer += '<ul class="resp-tabs-list">';

        this.collection.modelView.forEach(function (api) {
            buffer += api.resourcePath;
        });

        buffer += '</ul>';

        buffer += '<div class="resp-tabs-container">';

        this.collection.modelView.forEach(function (api) {
            buffer += api.content;
        });

        buffer += '</div>';


        buffer += '';
        buffer += '';


        //this.collection.each(this.addOne, this);
        console.log(buffer);

        $('#ui-container').empty();
        $('#ui-container').append(buffer);

        tpl.buildTab()
        return this;
    }
});


App.Views.UIContainer123 = Backbone.View.extend({

    initialize: function () {
        //this.collection.on('add', this.addOne, this);
        this.render();
    },

    tagName: 'div',

    render: function () {
        this.$el.empty();
        this.collection.each(this.addOne, this);
        console.log(this.el);
        return this;
    },
    addOne: function (task) {

        console.log(task.toJSON())
        var taskView = new App.Views.Task({ model: task });

        this.$el.append(taskView.render().el);
    }

//    render: function () {
//        this.collection = App.Apis;
//        this.$el.append(this.getVerticalTab());
//        return this;
//    },
//    getVerticalTab: function () {
//        console.log('getVerticalTab');
//
//        var buffer;
//
//        buffer = '<div id="verticalTab">';
//
//        buffer += '<ul class="resp-tabs-list">';
//
//        this.collection.each(function(api1){
//            api1.fetch()
//            console.log(api1);
//            console.log(api1.resourcePath);
//            console.log(api1.get('resourcePath'));
//        });
//
//        var days = this.collection.map(function(model){
//            return model.get('apiVersion');
//        });
//
//        App.Apis.models.forEach(function (api) {
//            buffer += '<li>';
//            console.log(api);
//            console.log(api.resourcePath);
//            console.log(api.get('resourcePath'));
//            buffer += api.get('resourcePath');
//            buffer += '</li>';
//        });
//        buffer += '</ul>';
//
//        buffer += '<div class="resp-tabs-container">';
//
//        buffer += '';
//
//        buffer += '</div>';
//
//
//        buffer += '';
//        buffer += '';
//
//
//        //this.collection.each(this.addOne, this);
//        console.log(buffer);
//        $('#ui-container').append(buffer);
//        return this;
//    }
});

App.Views.Task = Backbone.View.extend({
    initialize: function () {
        console.log(this.model.attributes)
    },
    tagName: 'li',
    //template: App.template('taskTemplate'),
    render: function () {


        console.log(this.model.toJSON())
        //console.log(this.template());
        //var template = this.template(this.model.toJSON());
        console.log(this.model);
        this.$el.html(this.model);
        return this;
    },
    remove: function () {
        this.$el.remove();
    }
});

//function getVerticalTab(collection){
//    buffer: "",
//
//
//
//        this.buffer = '<div id="verticalTab">';
//
//        this.buffer += '<ul class="resp-tabs-list">';
//
//        this.addLi;
//
////        collection.models.forEach(function (api) {
////            buffer += this.addLi(api);
////        });
//        this.buffer += '</ul>';
//
//        this.buffer += '<div class="resp-tabs-container">';
//
//        this.buffer += '';
//
//        this.buffer += '</div>';
//
//
//        this.buffer += '';
//        this.buffer += '';
//
//        console.log(this.buffer);
//        //this.collection.each(this.addOne, this);
//
//        buffer += '</div>';
//        this.$el.append(buffer);
//        return this;
//}


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


//window.WineView = Backbone.View.extend({
//
//    tagName: "div", // Not required since 'div' is the default if no el or tagName specified
//
//    initialize: function () {
//        this.template = _.template(tpl.get('wine-details'));
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
//        "click .save": "saveWine",
//        "click .delete": "deleteWine"
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
//    saveWine: function () {
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
//            app.wineList.create(this.model, {
//                success: function () {
//                    app.navigate('wines/' + self.model.id, false);
//                }
//            });
//        } else {
//            this.model.save();
//        }
//
//        return false;
//    },
//
//    deleteWine: function () {
//        this.model.destroy({
//            success: function () {
//                alert('Wine deleted successfully');
//                window.history.back();
//            }
//        });
//        return false;
//    }
//
//});
//
//
//window.WineListView = Backbone.View.extend({
//
//    tagName: 'ul',
//
//    initialize: function () {
//        this.model.bind("reset", this.render, this);
//        var self = this;
//        this.model.bind("add", function (wine) {
//            $(self.el).append(new WineListItemView({model: wine}).render().el);
//        });
//    },
//
//    render: function (eventName) {
//        _.each(this.model.models, function (wine) {
//            $(this.el).append(new WineListItemView({model: wine}).render().el);
//        }, this);
//        return this;
//    }
//});
//
//window.WineListItemView = Backbone.View.extend({
//
//    tagName: "li",
//
//    initialize: function () {
//        this.template = _.template(tpl.get('wine-list-item'));
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