$(function () {
    // пространство имён
    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };


    App.Models.Task = Backbone.Model.extend({
        defaults: {
            title: '',
            completed: 0,
            id: ''
        },

        urlRoot: 'rest'
    });

    var task = new App.Models.Task();

    App.Collections.Tasks = Backbone.Collection.extend({
        model: App.Models.Task,
        url: 'rest'
    })

    App.Views.Tasks = Backbone.View.extend({
        tagName: 'ul',
        initialize: function(){
            this.collection.on('add', this.addOne, this);
        },
        render: function () {
            this.$el.empty();
            this.collection.each(this.addOne, this);
            return this;
        },
        addOne: function (task) {
            // создавать новый дочерний вид
            var taskView = new App.Views.Task({ model: task });
            // добавлять его в корневой элемент
            this.$el.append(taskView.render().el);
        }
    });

    App.Views.Task = Backbone.View.extend({
        initialize: function () {
            this.model.on('destroy', this.remove, this);
        },
        tagName: 'li',
        template: template('taskTemplate'),
        render: function () {
            var template = this.template(this.model.toJSON());
            this.$el.html(template);
            return this;
        },
        remove: function () {
            this.$el.remove();
        }
    });

});