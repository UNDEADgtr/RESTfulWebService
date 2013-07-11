//Collection

window.App.Collections.WineCollection = Backbone.Collection.extend({
    model: Wine,
    url: "api/wines"
});

App.Collections.Apis = Backbone.Collection.extend({
    model: App.Models.Api,
    modelView: new Array()
});