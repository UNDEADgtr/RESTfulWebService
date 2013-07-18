//Models

App.Models.URLSettings = Backbone.Model.extend({
    defaults: {
        discoveryUrl: "",
        apiKey: ""
    },
    validate: function (attrs) {

    }
});

App.Models.ApiDoc = Backbone.Model.extend({
    validate: function (attrs) {

    }
});

App.Models.Api = Backbone.Model.extend({
    initialize: function () {
        this.urlRoot = this.get('urlRoot');
    },
    description: "",
    urlRoot: ""
});

App.Models.Response = Backbone.Model.extend({
    initialize: function () {
    },
    urlRoot: '',
    methodToURL: {
        'get': 'read',
        'post': 'create',
        'put': 'update',
        'delete': 'delete'
    },
    sync: function (method, options) {
        var that = this;
        var crud = this.methodToURL[method.toLowerCase()];

        options = options || {};

        options.url = this.urlRoot;
        options.wait = true;
        options.success = function (data, textStatus, jqXHR) {
            that.set(data)
            that.xhr = jqXHR;
        }
        options.error = function (data, jqXHR) {
            that.set(data)
            that.xhr = jqXHR;
        }

        return Backbone.sync(crud, this, options);
    }
});


