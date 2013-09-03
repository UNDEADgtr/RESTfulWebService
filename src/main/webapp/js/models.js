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
        } else if (Types.isCollectionTypes(type.substring(0, type.indexOf('[')))) {

            var clazz = type.substring(0, type.indexOf('['));

            if (clazz == 'list' || clazz == 'array') {
                var errors = null;

                if (Array.isArray(value)) {
                    var i = 0;

                    value.forEach(function (entity) {

                        //console.log(entity)

                        var newErrors = validateParametersAsModel(attrs.classEntity, entity);

                        if (newErrors) {
                            if (!errors) {
                                errors = {};
                            }
                            for (var key in newErrors) {
                                errors['Object ' + i + ' ' + key] = newErrors[key];
                            }
                        }
                    });
                } else {
                    errors = {};
                    errors['Object'] = "Object is not Array or List"
                }


                if (errors) {
                    console.log(errors)
                    this.validationErrors = errors;
                    return 'The value "' + name + '" does not match the type of "' + type + '".';
                }
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
        case 'int':
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
            if (Validation.date(value)) {
                var testDate = new Date(value);
                if (isNaN(testDate.getDate())) {
                    return false;
                }
            } else {
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
//        options.success = function (data, textStatus, jqXHR) {
//            that.set(data)
//            that.xhr = jqXHR;
//        }
//        options.error = function (data, jqXHR) {
//            that.set(data)
//            that.xhr = jqXHR;
//        }

        return Backbone.sync(crud, this, options);
    }
});

App.Models.Session = Backbone.Model.extend({
    defaults: {
        access_token: null,
        user_id: null
    },
    authenticated: (this.access_token != null),
    initialize: function () {
        this.load()
    },
    save: function (auth_hash) {
        //$.cookie('user_id', auth_hash.id)
        //$.cookie('access_token', auth_hash.access_token)
    },
    load: function () {
        //this.user_id = $.cookie('user_id')
        //this.access_token = $.cookie('access_token')
    }
})

