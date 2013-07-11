//Models


window.Wine = Backbone.Model.extend({
    urlRoot: "api/wines",
    defaults: {
        "id": null,
        "name":  "",
        "grapes":  "",
        "country":  "USA",
        "region":  "California",
        "year":  "",
        "description":  "",
        "picture":  ""
    }
});


App.Models.URLSettings = Backbone.Model.extend({
    defaults: {
        discoveryUrl: "",
        apiKey: ""
    },
    validate: function(attrs) {

    }
});

App.Models.ApiDoc = Backbone.Model.extend({
//    initialize:function(){
//        this.urlRoot = this.get('urlRoot');
//        this.fetch();
//    },
    defaults: {
        apis: new Array()
    },
    validate: function(attrs) {

    }
});

App.Models.Api = Backbone.Model.extend({
    initialize:function(){
        this.urlRoot = this.get('urlRoot');
    },
    description : "",
    urlRoot: "",
    getLi: function(){
        return '<li>' + this.get('resourcePath') + '</li>'
    }
});

App.Models.Task = Backbone.Model.extend({
    validate: function(attrs) {
        if( ! attrs.title || ! attrs.when ) {
            return 'title и when обязательны для заполнения!';
        }
    }
});



