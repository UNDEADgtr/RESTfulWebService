$(function () {
    // пространство имён
    window.App = {
        Models: {},
        Collections: {},
        Views: {}
    };

    App.Models.Task = Backbone.Model.extend({
        validate: function (attrs) {
            if (!$.trim(attrs.title)) {
                return 'title is null';
            }
        }
    });

    App.Views.Task = Backbone.View.extend({
        initialize: function () {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },
        tagName: 'li',
        template: template('taskTemplate'),
        render: function () {
            var template = this.template(this.model.toJSON());
            this.$el.html(template);
            return this;
        },
        events: {
            'click .edit': 'editTask',
            'click .delete': 'destroy'
        },
        editTask: function () {
            var newTaskTitle = prompt('Как переименуем задачу?', this.model.get('title'));
            this.model.set('title', newTaskTitle, {validate: true});
        },
        destroy: function () {
            this.model.destroy();
            //console.log(tasksCollection);
        },
        remove: function () {
            this.$el.remove();
        }
    });

    App.Collections.Task = Backbone.Collection.extend({
        model: App.Models.Task
    });

    App.Views.Tasks = Backbone.View.extend({
        tagName: 'ul',
        initialize: function(){
            this.collection.on('add', this.addOne, this);
        },
        render: function () {
            this.collection.each(this.addOne, this);
            return this;
        },
        addOne: function (task) {
            // создавать новый дочерний вид
            var taskView = new App.Views.Task({ model: task });
            // добавлять его в корневой элемент
            this.$el.append(taskView.render().el);
        }
    })

    App.Views.AddTask = Backbone.View.extend({
        el: '#addTask',
        initialize: function () {
            //console.log(this.el.innerHTML);
        },
        events: {
            'submit': 'submit'
        },
        submit: function (e) {
            e.preventDefault();
            var  newTaskTitle = $(e.currentTarget).find('input[type=text]').val();
            //console.log(newTaskTitle);
            var newTask = new App.Models.Task({title : newTaskTitle});
            //console.log(newTask);
            this.collection.add(newTask);

        }
    });

    window.tasksCollection = new App.Collections.Task([
        {
            title: 'Сходить в магазин',
            priority: 4
        },
        {
            title: 'Получить почту',
            priority: 3
        },
        {
            title: 'Сходить на работу',
            priority: 5
        }
    ]);

    var tasksView = new App.Views.Tasks({ collection: tasksCollection});

    $('.tasks').html(tasksView.render().el);

    var addTask = new App.Views.AddTask({collection: tasksCollection});
});