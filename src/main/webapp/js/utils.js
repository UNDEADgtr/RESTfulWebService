window.App = {
    Models: {},
    Collections: {},
    Views: {},
    Router: {},
    template: {},
    URLSettings: {},
    View: {},
    AddUrlSettings: {},
    basePath: '',
    loginPath: '',
    version: '0.1',
    session: null
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
        if(!clazz){
            return null;                                                                            //!!!!!!!!!!!!!!!!!!!!!!!!!!
        }

        var models = this.models;
        if (clazz.indexOf('[') >= 0) {
            clazz = clazz.substring(clazz.indexOf('[') + 1, clazz.indexOf(']'));
            //console.log(clazz)
        }

        for (var clazzName in models) {
            if (clazz == clazzName) {
                return models[clazzName]
            }
        }
        return null
    },
    getFirstElement: function (model) {
        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                return model[key];
            }
        }
    },
    parseWithValidation: function (json, message, sticker) {
        if(!json){
            this.jsonMessage("Json data is empty", "Json data is empty")
            return null;
        }
        try {
            var result = JSON.parse(json);
            return result;
        }
        catch (e) {
            if(message){
                this.jsonMessage(message, sticker);
            } else{
                this.jsonMessage("Invalid json format.", "Invalid json format.")
            }
            return null;
        }
    },
    jsonMessage: function (message, sticker) {
        if(message){
            Message.addError(message);
        }
        if(sticker){
            Message.addStickerError(sticker);
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
    date: function (date) {
        var a = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
        return a.test(date);
    },
    apiDocs: function (api) {
        var errors = this.baseApiValidation(api);
        if (!errors) {
            errors = {};
        }

        if (!api.scriptVersion) {
            errors['scriptVersion'] = 'Parameter is mandatory';
        }

        return Object.keys(errors).length == 0 ? null : errors;
    },
    api: function (api) {
        var errors = this.baseApiValidation(api);
        if (!errors) {
            errors = {};
        }
        api.apis.forEach(function (a) {

            a.operations.forEach(function (operation) {
                //console.log(operation)
                if (!operation.httpMethod) {
                    errors['httpMethod'] = 'Parameter is mandatory';
                }
                if (!operation.nickname) {
                    errors['nickname'] = 'Parameter is mandatory';
                }
//                if (!operation.responseClass) {
//                    errors['responseClass'] = 'Parameter is mandatory';
//                }
                if (operation.parameters) {
                    operation.parameters.forEach(function (parameter) {
                        if (!parameter.dataType) {
                            errors['dataType'] = 'Parameter is mandatory';
                        }
                        if (!parameter.paramType) {
                            errors['paramType'] = 'Parameter is mandatory';
                        }
                    });
                }
                if (operation.errorResponses) {
                    operation.errorResponses.forEach(function (errorResponse) {
                        if (!errorResponse.code) {
                            errors['code'] = 'Parameter is mandatory';
                        }
                        if (!errorResponse.reason) {
                            errors['reason'] = 'Parameter is mandatory';
                        }
                    });
                }
            });
        })
        for(var clazz in api.models){
            for(var key in api.models[clazz].properties){
                var property = api.models[clazz].properties[key];
                if (!property.type) {
                    errors['type'] = 'Parameter is mandatory';
                }
            }
        }

        return Object.keys(errors).length == 0 ? null : errors;
    },
    baseApiValidation: function (api) {
        var errors = {}
//        if (!api.apiVersion) {
//            errors['apiVersion'] = 'Parameter is mandatory';
//        }
        if (api.basePath) {

        } else {
            errors['basePath'] = 'Parameter is mandatory';
        }
        if (api.apis) {
            if (Object.keys(api.apis).length == 0) {
                errors['apis'] = 'Parameter is empty';
            } else {
//                api.apis.forEach(function (obj) {
//                    if (!obj.path) {
//                        errors['path'] = 'Parameter is mandatory in "apis"';
//                    }
//                });
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
    simpleTypes: new Array('int', 'integer', 'long', 'float', 'double', 'string', 'boolean', 'date', 'dateTime'),
    collectionTypes: new Array('list', 'array', 'map'),
    isSimpleTypes: function (name) {
        name = name.toLowerCase();
        return this.simpleTypes.indexOf(name) >= 0;
    },
    isCollectionTypes: function (name) {
        console.log(name)
        name = name.toLowerCase();
        return this.collectionTypes.indexOf(name) >= 0;
    }
}



