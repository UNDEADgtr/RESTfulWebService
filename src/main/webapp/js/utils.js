window.App = {
    Models: {},
    Collections: {},
    Views: {},
    Router: {},
    template: {},
    URLSettings: {},
    View: {},
    AddUrlSettings: {},
    basePath: ''
}


var ClassUtil = {
    getClassAsFormatJsonString: function (clazz) {
        var models = this.models;
        for (var clazzName in models) {
            if (clazz == clazzName) {
                var properties = models[clazzName].properties;
                var data = { };
                for (var name in properties) {
                    data[name] = properties[name].type;
                }
                var result = {};
                result[clazzName] = data;
                return JSON.stringify(result, '', 3)
            }
        }
        return clazz
    },
    getClassAsJson: function (clazz) {
        var models = this.models;
        for (var clazzName in models) {
            if (clazz == clazzName) {
                return models[clazzName]
            }
        }
        return false
    },
    openOperationsForResource: function (resource) {

    }
};

var Message = {
    clean: function () {
        $('#message-bar').empty();
        $('#message-bar').removeClass('message-success')
        $('#message-bar').removeClass('message-fail')
    },
    add: function (message) {
        this.clean();
        $('#message-bar').addClass('message-success')
        $('#message-bar').append(message);
    },
    addError: function (message) {
        this.clean();
        $('#message-bar').addClass('message-fail')
        $('#message-bar').append(message);
    }
}

var Validation = {
    url: function (url) {
        //var a = /((ftp|https?):\/\/)?(www\.)?[a-z0-9\-\.]{3,}\.[a-z]{3}$/
        return true//a.test(url);
    }
}



