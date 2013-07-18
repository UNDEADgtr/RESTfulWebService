// Main

//Backbone.View.prototype.close = function () {
//    console.log('Closing view ' + this);
//    if (this.beforeClose) {
//        this.beforeClose();
//    }
//    this.remove();
//    this.unbind();
//};

var AppRouter = Backbone.Router.extend({

    initialize: function () {
        var header = new App.Views.HeaderView();
    },

    routes: {
        "": "list",
        "rest/new": "newTask"
    },

    list: function () {
        //this.before();
    },
    before: function (callback) {
    }
});

tpl.loadTemplates(['headerTempl', 'headerTempl1'], function () {
    app = new AppRouter();
    Backbone.history.start();
});


//$(document).ready(function() {
//    $('form').validate();
//});


//$.validator.addClassRules({
//    required: {
//        required: true
//
//    }
//});



