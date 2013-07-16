(function() {
    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {},
        template: {}

    }

    window.vent = _.extend({}, Backbone.Events);

    App.template = function(id) {
        return Handlebars.compile($('#' + id).html() );
    };


    var AppRouter = Backbone.Router.extend({

        initialize: function () {
            //$('#header').html(new HeaderView().render().el);

            var header = new App.Views.HeaderView();

            //console.log('s')
            //console.log(App.Apis)
        },

        routes: {
            "": "list",
            "wines/new": "newWine"
        },

        list: function () {


            //this.before();
        },

        newWine: function () {
            this.before(function () {
                app.showView('#content', new WineView({model: new Wine()}));
            });
        },

        showView: function (selector, view) {
            if (this.currentView)
                this.currentView.close();
            $(selector).html(view.render().el);
            this.currentView = view;
            return view;
        },

        before: function (callback) {
            if (this.wineList) {
                if (callback) callback();
            } else {
                //this.wineList = new App.Collections.WineCollection();
//       		this.wineList.fetch({success: function() {
//               $('#sidebar').html( new WineListView({model: app.wineList}).render().el );
//               if (callback) callback();
//            }});
            }
        }

    });

}());