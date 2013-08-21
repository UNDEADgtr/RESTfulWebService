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


var JsonUtil = {
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
    validateModel: function (model, values) {
        var models = this.models;

        for (var name in values) {

            model.parameters.forEach(function (parameter) {
                if (parameter.name == name || parameter.dataType == name) {

                    //console.log(parameter.dataType)
                    //console.log(models[parameter.dataType])

                    if(parameter.dataType in models){


                        //console.log('123');
                        var modelObject = models[name];




                    }
                }
            })
        }

//        for(var k in result) {
//            console.log(k, result[k]);
//        }

        for (var clazzName in models) {
//            if (clazz == clazzName) {
//
//                var properties = models[clazzName].properties;
//                var data = { };
//                for (var name in properties) {
//                    data[name] = properties[name].type;
//                }
//                var result = {};
//                result[clazzName] = data;
//
//                return true
//            }
        }
        return false;
    },
    getFirstElement: function (model) {
        for(var key in model) {
            if(model.hasOwnProperty(key)) {
                return model[key];
            }
        }
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

var Converter = {
    nameToJQueryName: function (name) {
        name = name.replace('[', '\\[');
        name = name.replace(']', '\\]');
        return name;
    },
    replaceAll: function (name, find) {
        //var find = 'abc';
        var re = new RegExp(find, 'g');
        name = name.replace(re, '');
        return name.replace(new RegExp(find, 'g'), replace);
    }

}




