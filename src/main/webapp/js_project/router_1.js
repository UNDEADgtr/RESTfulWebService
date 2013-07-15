$(function () {
    // пространство имён
    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };

    var vent = _.extend({}, Backbone.Events);

    App.Views.SpecialTask = Backbone.View.extend({
        initialize: function(){
            vent.on('specialTasks: show', this.show, this);
        },
        show: function(id){
            console.log('specialTasks Show:' + id);
        }
    });

    App.Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'read': 'read',
            'page/:id': 'page',
            'page/:id/*splat': 'page2',
            'specialTasks/:id' : 'showSpecialTasks',
            '*other': 'default'

        },
        index: function () {
            console.log('index');
        },
        read: function () {
            console.log('read');
        },
        page: function (id) {
            console.log('page - ' + id);
        },
        page2: function (id, splat) {
            console.log('page - ' + id + ' splat - ' + splat);
        },
        default: function(other) {
            console.log('Что-то не то!!! Вы находитесь на роуте ' + other);
        },
        showSpecialTasks: function(id) {
            vent.trigger('specialTasks:show', id);
        }

    });

    new App.Views.SpecialTask;

    new App.Router();

    Backbone.history.start();
});