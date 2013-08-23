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

App.Models.Parameter = Backbone.Model.extend({
    initialize: function () {
    },
    validate: function (attrs, options) {
        var type = attrs.type.toLowerCase();
        var value = attrs.value;
        var name = attrs.name;


        if (Types.isSimpleTypes(type)) {
            if (!validateSimpleParameters(type, value)) {
                return 'The value "' + name + '" does not match the type of "' + type + '".';
            }
        } else if (attrs.classEntity && (attrs.classEntity.id.toLowerCase() == type.toLowerCase())) {
            var errors = validateParametersAsModel(attrs.classEntity, value);
            if (errors) {
                console.log(errors)
                this.validationErrors = errors;
                return 'The value "' + name + '" does not match the type of "' + type + '".';
            }
        } else {
            return 'Parameter type "' + type + '" is invalid';
        }
    }
});

function validateSimpleParameters(type, value) {
    //console.log(type, value)
    type = type.toLocaleLowerCase()
    switch (type) {
        case 'integer':
        {
            if (isNaN(parseInt(value))) {
                return false;
            }
            break;
        }
        case 'long':
        case 'float':
        case 'double':
        {
            if (isNaN(parseFloat(value))) {
                return false;
            }
            break;
        }
        case 'string':
        {
            if (!(toString.call(value) == '[object String]')) {
                return false;
            }
            break;
        }
        case 'boolean':
        {
            if (value != true && value != false && value != 'true' && value != 'false') {
                return false;
            }
            break;
        }
        case 'date':
        case 'dateTime':
        {
            var testDate = new Date(value);
            if (isNaN(testDate.getDate())) {
                return false;
            }
            break;
        }
    }
    return true;
}

function validateParametersAsModel(pattern, value) {
    //console.log(pattern.properties, value);
    var errors = {}
    for (var key in pattern.properties) {
        var property = pattern.properties[key];
        if (value[key]) {
            if (!validateSimpleParameters(property.type, value[key])) {
                errors[key] = 'Parameter value is invalid';
            }
        } else if (property.required) {
            errors[key] = 'Parameter is mandatory';
        }
    }
    return Object.keys(errors).length == 0 ? null : errors;
}

App.Models.Entity = Backbone.Model.extend({
    initialize: function () {
    },
    entityModel: {},
    validate: function (attrs) {

    }
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
        //console.log(options)
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


