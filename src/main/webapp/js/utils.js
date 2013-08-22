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
        if(clazz.indexOf('[') >= 0){
            clazz = clazz.substring(clazz.indexOf('[') + 1,clazz.indexOf(']'));
            //console.log(clazz)
        }

        for (var clazzName in models) {
            if (clazz == clazzName) {
                return models[clazzName]
            }
        }
        return null
    },
    validateModel: function (model, values) {
        var models = this.models;
        var isValid = true;

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
        return isValid;
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
    },
    addStickerError: function (message) {
        $.sticker({note: message, className: 'stick-error'});
    },
    addStickerWarning: function (message) {
        $.sticker({note: message, className: 'stick-classic'});
    },
    addStickerErrorsAsOne: function (errors) {
        var buffer = '';
        for (var key in errors) {
            buffer = buffer + key + ': ' + errors[key] + '<br/>';
        }
        Message.addStickerError(buffer);
    },
    addStickerErrorsAsMany: function (errors) {
        for (var key in errors) {
            Message.addStickerError(key + ': ' + errors[key]);
        }
    }
}

var Validation = {
    url: function (url) {
        //var a = /((ftp|https?):\/\/)?(www\.)?[a-z0-9\-\.]{3,}\.[a-z]{3}$/
        return true//a.test(url);
    },
    apiDocs: function (api) {
//        "apiVersion": "0.2",
//            "scriptVersion": "1.1",
//            "basePath": "http://localhost:8080/RESTfulWebService/api",
//            "apis": [
//            {
//                "path": "/user",
//                "description": ""
//            }
//        ]
        var errors = {}
        if(!api.apiVersion){
            errors['apiVersion'] = 'Parameter is mandatory';
        }
        if(!api.scriptVersion){
            errors['scriptVersion'] = 'Parameter is mandatory';
        }
        if(api.basePath){

        } else {
            errors['basePath'] = 'Parameter is mandatory';
        }
        if(api.apis){
            if(Object.keys(api.apis).length == 0){
                errors['apis'] = 'Parameter is empty';
            } else {
                api.apis.forEach(function(obj){
                    if(!obj.path){
                        errors['path'] = 'Parameter is mandatory in "apis"';
                    }
                });
            }
        } else {
            errors['apis'] = 'Parameter is mandatory';
        }
        return Object.keys(errors).length == 0 ? null : errors;
    }
}

var Converter = {
    nameToJQueryName: function (name) {
        name = name.replace('[', '\\[');
        name = name.replace(']', '\\]');
        return name;
    },
    replaceAll: function (name, find) {
        var re = new RegExp(find, 'g');
        name = name.replace(re, '');
        return name.replace(new RegExp(find, 'g'), replace);
    }
}

var Types = {
    simpleTypes : new Array('integer', 'long', 'float', 'double', 'string', 'boolean', 'date', 'dateTime'),
    collectionTypes : new Array('list', 'array', 'map'),
    isSimpleTypes: function (name) {
        name = name.toLowerCase();
        return this.simpleTypes.indexOf(name) >= 0;
    },
    isCollectionTypes: function (name) {
        name = name.toLowerCase();
        return this.collectionTypes.indexOf(name) >= 0;
    }
}



