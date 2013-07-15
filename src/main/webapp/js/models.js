//Models

App.Models.URLSettings = Backbone.Model.extend({
    defaults: {
        discoveryUrl: "",
        apiKey: ""
    },
    validate: function(attrs) {

    }
});

App.Models.ApiDoc = Backbone.Model.extend({
    validate: function(attrs) {

    }
});

App.Models.Api = Backbone.Model.extend({
    initialize:function(){
        this.urlRoot = this.get('urlRoot');
    },
    description : "",
    urlRoot: ""
});


