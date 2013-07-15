//Views

//Main

App.Views.App = Backbone.View.extend({
    initialize: function () {
        var addTask = new App.Views.AddTask({collection: App.tasks});
        var allTaskView = new App.Views.Tasks({ collection: App.tasks }).render();
        $('#allTasks').append(allTaskView.el);
    }
});

//Add task view

App.Views.AddTask = Backbone.View.extend({

    initialize: function () {
        this.title = $('#title');
        this.when = $('#when');
        this.description = $('#description');
    },

    el: '#addTask',

    events: {
        'submit': 'addTask'
    },

    addTask: function (e) {
        e.preventDefault();

        var newTask = this.collection.create({
            title: this.$('#title').val(),
            when: this.$('#when').val(),
            description: this.$('#description').val()
        }, {wait: true});

        this.clearForm();

    },
    clearForm: function () {
        this.title.val('');
        this.when.val('');
        this.description.val('');
    }
});

/*
 |---------------------------------------------------
 |  All Tasks View
 |---------------------------------------------------
 */
App.Views.Tasks = Backbone.View.extend({

    initialize: function() {
        this.collection.on('add', this.addOne, this);
    },

    tagName: 'tbody',

    render: function () {
        this.collection.each(this.addOne, this);

        return this;
    },

    addOne: function (task) {
        var taskView = new App.Views.Task({ model: task });
        console.log(taskView.render().el);
        this.$el.append(taskView.render().el);
    }
});

/*
 |---------------------------------------------------
 | Single Task View
 |---------------------------------------------------
 */

App.Views.Task = Backbone.View.extend({
    tagName: 'tr',

    template: App.template('taskTemplate'),

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }

});