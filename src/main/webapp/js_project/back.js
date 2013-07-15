//(function () {
    window.App = {
        Models: {},
        Views: {},
        Collections: {}
    };

    App.Models.Person = Backbone.Model.extend({
        defaults: {
            name: 'Dima',
            age: 23,
            job: 'web developer'
        },
        validate: function (attrs) {

            if (attrs.age <= 0) {
                return 'Возраст должен быть положительным!';
            }

        },
        walk: function () {
            return this.get('name') + ' is walking.';
        }
    });

    App.Collections.People = Backbone.Collection.extend({
        model: App.Models.Person
    });

    App.Views.Person = Backbone.View.extend({

        initialize: function () {
            //console.log(this.model)
        },
        //template: _.template('<strong><%= name %></strong> ( <%= age %> ) - <%= job %>'),
        //template: _.template( $('#person-id').html() ),
        template: template('person-id'),

        tagName: 'li',
        className: 'person',

        render: function () {
            //this.$el.html( this.model.get('name') + ' (' + this.model.get('age') + ') - ' + this.model.get('job') );
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

//Вид списка людей
    App.Views.People = Backbone.View.extend({
        tagName: 'ul',

        initialize: function () {
        },

        render: function () {
            this.collection.each(function (person) {
                var personView = new App.Views.Person({model: person});
                this.$el.append(personView.render().el);
            }, this);

            $(document.body).html(this.$el)
            return this;
        }

    });

    var person = new App.Models.Person;
    //var personView = new PersonView({ model: person });

    var person2 = new App.Models.Person({name: 'Петр', age: 'Менеджер'});
    //var personView2 = new PersonView({model: person2});

    var peopleCollection = new App.Collections.People();

    peopleCollection.add(person);
    peopleCollection.add(person2);

    var peopleView = new App.Views.People({collection: peopleCollection});

    console.log(peopleView.render().el)

//}());
