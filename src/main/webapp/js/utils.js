window.App = {
    Models: {},
    Collections: {},
    Views: {},
    Router: {},
    template: {},
    URLSettings: {},
    ApiDoc123: {},
    View: {},
    AddUrlSettings: {}
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
    },
    add: function (message) {
        this.clean();
        $('#message-bar').append(message);
    }

}
