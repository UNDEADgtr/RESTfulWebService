//Collection

App.Collections.Apis = Backbone.Collection.extend({
    model: App.Models.Api,
    modelView: new Array()
});

App.Collections.Parameters = Backbone.Collection.extend({
    model:App.Models.Parameter,
    getModel: function(modelName){

    }
});