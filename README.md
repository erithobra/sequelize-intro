![](https://i.imgur.com/yvEYhnZ.png)


## Objectives

- Create CRUD API routes and methods for a single resource
- Connect Sequelize to an exisiting Postgres database
- Explain the advantages of using Sequelize vs writing SQL queries from scratch
- Learn to use Postman to test our routes before building a view


## What is Sequelize?

[Sequelize](http://docs.sequelizejs.com/) is a promise-based ORM (Object Relational Mapper) for Node.js v4 and up. It supports the dialects PostgreSQL, MySQL, SQLite and MSSQL and features solid transaction support, relations, read replication and more.

Sequelize creates objects that wrap our data in extra methods, properties and Promises. Additionally, since Sequelize is written in Javascript, we'll use Object Oriented Programming to create our SQL queries.

For example, to find all the instances of a user in a database:

```js
// SQL query 
SELECT * FROM "Fruits";

// Sequelize query
Fruit.findAll()
```

Sequelize is super helpful when dealing with asynchronicity and associations (joins) between tables. We'll talk about it more later.

## Sequelize CLI

The Sequelize CLI (command line interface) makes it easy to add Sequelize to an existing app. 

- [Sequelize CLI GitHub](https://github.com/sequelize/cli)
- [Sequelize CLI Docs](http://docs.sequelizejs.com/manual/tutorial/migrations.html)
- [Docs](https://sequelize.org/master/)

Run this from your cmd prompt: 

```
npm install -g sequelize-cli
npm install sequelize
npm install pg --save
```

After that run `sequelize`, if successfully installed you should see

```
Sequelize CLI [Node: 12.16.3, CLI: 5.5.1, ORM: 5.21.9]

sequelize [command]

Commands:
  sequelize db:migrate                        Run pending migrations
  sequelize db:migrate:schema:timestamps:add  Update migration table to have timestamps
  sequelize db:migrate:status                 List the status of all migrations
  sequelize db:migrate:undo                   Reverts a migration
  sequelize db:migrate:undo:all               Revert all migrations ran
  sequelize db:seed                           Run specified seeder
  sequelize db:seed:undo                      Deletes data from the database
  sequelize db:seed:all                       Run every seeder
  sequelize db:seed:undo:all                  Deletes data from the database
  sequelize db:create                         Create database specified by configuration
  sequelize db:drop                           Drop database specified by configuration
  sequelize init                              Initializes project
  sequelize init:config                       Initializes configuration
  sequelize init:migrations                   Initializes migrations
  sequelize init:models                       Initializes models
  sequelize init:seeders                      Initializes seeders
  sequelize migration:generate                Generates a new migration file                 [aliases: migration:create]
  sequelize model:generate                    Generates a model and its migration                [aliases: model:create]
  sequelize seed:generate                     Generates a new seed file                           [aliases: seed:create]

Options:
  --help     Show help                                                                                         [boolean]
  --version  Show version number                                                                               [boolean]
```

#### Sequelize Init in an App

To use the Sequelize CLI we run `sequelize init` in the root directory of our app. This command will create the following files and folders:

![](https://i.imgur.com/5gyMcQv.png)

We'll be walking through these in more detail.


#### Configure database details

One of the files + folders that the Sequelize CLI created for us is `config/config.json`. Typically, we'd have 3 seperate databases for each environment (test, development, production). Why not use the same database for each?

Let's update the file to this:

`config/config.json`

```js
{
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "fruits_dev",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "operatorsAliases": false
  }
}
```

What did we change?

- _Optional_: We're only using a development database today so we removed the other environments.
- We make sure the `database` value is the one we created.
- We change the dialect to `postgres` since that's the type of database we're using.

4. Go back to cmd prompt and connect to postgres

```
psql -U postgres

postgres=# CREATE DATABASE fruits_dev;
CREATE DATABASE
```

## Create Fruit model

Before we start with creating a fruit model, lets make one small change in our existing app. We will move `models\fruits.js` file from models folder to the parent folder, that is directly under `fruit-app`. And since we have changed the location of this file we will change the import in `controllers/fruits.js` to `const fruits = require('../fruits.js')`

**Make sure you make the above change before moving forward**

### sequelize model:generate

Sequelize CLI created a `models/index.js` file for us. There is a lot of plumbing in here! Mainly, this file...

- Imports the Sequelize module once and shares it between all models we create
- Helps to set up associations between models
- DRYs up our code. Importing this one file will give us access to all models.

Let's use the Sequelize CLI `model:generate` command to create a `Fruit` model with `name`, `color` and `readyToEat` attributes:


`sequelize model:generate --name Fruit --attributes name:string,color:string,readyToEat:boolean`

- **IMPORTANT**: Make sure that there are **NO** spaces after the commas.

Two files were created for us the first is the `models/fruit.js` model file.

```js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Fruit = sequelize.define('Fruit', {
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    readyToEat: DataTypes.BOOLEAN
  }, {});
  Fruit.associate = function(models) {
    // associations can be defined here
  };
  return Fruit;
};
```

This file describes what attributes and methods each instance of a `Fruit` should have in our database. How are attributes stored in our database?

#### `migrations/<TIMESTAMP>-create-fruit.js`

Migrations are how we manage the state of our database. Notice that each file is prefaced with a timestamp. You'll learn more about migrations tomorrow. Here's the file:

```js
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Fruits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      readyToEat: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        defaultValue: new Date(),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: new Date(),
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Fruits');
  }
};
```

This file tells the database to create a `fruits` table. It also defines each column's name and Sequelize datatype.

A Migration in Sequelize is javascript file which exports two functions, `up` and `down`, that dictate how to perform the migration and undo it. You define those functions manually, but you don't call them manually; they will be called automatically by the CLI. In these functions, you should simply perform whatever queries you need, with the help of `sequelize.query` and whichever other methods Sequelize provides to you.


### sequelize db:migrate

So far we've created a migration file, but our database has not recieved the instructions. We need to run our migrations folder to tell the database what we want it to look like. Let's run this command from the root directory of your app: 

`sequelize db:migrate` 

This command will execute these steps:

- Will ensure a table called `SequelizeMeta` in database. This table is used to record which migrations have run on the current database
- Start looking for any migration files which haven't run yet. This is possible by checking SequelizeMeta table. In this case it will run `XXXXXXXXXXXXXX-create-fruit.js` migration, which we created in last step.
- Creates a table called `Fruits` with all columns as specified in its migration file.

This is what you'll see on cmd prompt after running the above command,

```
Sequelize CLI [Node: 12.16.3, CLI: 5.5.1, ORM: 5.21.9]

Loaded configuration file "config\config.json".
Using environment "development".
(node:11100) [SEQUELIZE0004] DeprecationWarning: A boolean value was passed to options.operatorsAliases. This is a no-op with v5 and should be removed.
== 20200518203858-create-fruit: migrating =======
== 20200518203858-create-fruit: migrated (0.058s)
```


Just to confirm, let's go into the `psql` shell and confirm that a `Fruits` table has been created.

1. `psql` - You can run this command from any directory to enter the Postgres shell
2. `\l` - See the list of databases
3. `\c fruits_dev` - Connect to our database
4. `\dt` - This will show the database tables
	

### sequelize seed:generate

The last folder that Seqelize created for us is a `seeders` folder. This is where we can add seeds for our database. Why might seeds be useful?

Let's have the Sequelize CLI scaffold a timestamped file for `Fruit` seeds in the seeders folder:

`sequelize seed:generate --name demo-fruits`

This created an empty seeders file. Fill it in like so:

```js
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Fruits', [
      {
          name:'apple',
          color: 'red',
          readyToEat: true,
          createdAt: new Date(),
          updatedAt: new Date()
      },
      {
          name:'pear',
          color: 'green',
          readyToEat: false,
          createdAt: new Date(),
          updatedAt: new Date()
      },
      {
          name:'banana',
          color: 'yellow',
          readyToEat: true,
          createdAt: new Date(),
          updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Fruits', null, {});
    */
  }
};
```

#### What's going on here!?

- When we run this seeders file, the `up` method will run. If we ever want to undo or rollback these seeds, the `down` method will run.
- `queryInterface.bulkInsert` is an efficent Sequelize method to dump an array of objects into our database all at once.
- We're also adding some `createdAt` and `updatedAt` fields since those are required.


### sequelize db:seed:all

Run `sequelize db:seed:all` to seed your `fruits` table.

##### Confirm in `psql`

Run `SELECT * FROM "Fruits";`


### Update Controller

[Sequelize Queries](http://docs.sequelizejs.com/manual/tutorial/querying.html)

[Sequelize Docs](https://sequelize.org/master/manual/models-usage.html)


#### Require the Fruit model in the fruits.js controller file

First things first, we need to let our controller file `controllers/fruits.js` know about the `Fruit` model. We'll `require` the Sequelize `models/index.js` file. This file essentally `exports` an object that contains a property for each model.

```js
// At the top of the file

const Fruit = require('../models').Fruit;
```

Now we are going to update all our controller functions one by one.

`controllers/fruits.js`:

#### Get all Fruits (index())

We will update our index funtion to query the database to get all fruits and just like earlier render `index.ejs` view to display all fruits.

Previously,

```
const index = (req, res) => {
    res.render('index.ejs', {
        fruits : fruits
    });
};
```

Now,

```js
const index = (req, res) => {
    Fruit.findAll()
    .then(fruits => {
        res.render('index.ejs', {
            fruits : fruits
        });
    })
    
};
```
	

#### Get one Fruit (show())

Previously,

```
const show = (req, res) => {
    res.render('show.ejs', {
        fruit: fruits[req.params.index]
    });
}
```

Now,

```js
const show = (req, res) => {
    Fruit.findByPk(req.params.index)
    .then(fruit => {
        res.render('show.ejs', {
            fruit: fruit
        });
    })
}
```

To have the link work we will have to make one more change in `views/index.ejs`. Currently the input sent in url is the index of the fruit since earlier `fruits` was an array. Like this,

```
...
	The <a href="/fruits/<%=i%>"><%=fruits[i].name; %></a> is  <%=fruits[i].color; %>.
...
```

But now we will send `fruit.id` as input in the URL so that id can be used to query the database.

```
...
	The <a href="/fruits/<%=fruits[i].id%>"><%=fruits[i].name; %></a> is  <%=fruits[i].color; %>.
...
```


#### Create a Fruit (postFruit())

Previously,

```
const postFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){ 
        req.body.readyToEat = true; 
    } else { 
        req.body.readyToEat = false;
    }
    fruits.push(req.body);
    
    res.redirect('/fruits');
}
```

Now,

```js
const postFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){ 
        req.body.readyToEat = true; 
    } else { 
        req.body.readyToEat = false;
    }

    Fruit.create(req.body)
    .then(newFruit => {
        res.redirect('/fruits');
    })
}
```

#### Delete a Fruit (deleteFruit())

Previously,

```
const deleteFruit = (req, res) => {
    fruits.splice(req.params.index, 1);
	res.redirect('/fruits');
}
```

Now,

```js
const deleteFruit = (req, res) => {
    Fruit.destroy({ where: { id: req.params.index } })
    .then(() => {
        res.redirect('/fruits');
    })	
}
```

And just like earlier we will update delete link our `index.ejs` to send the fruit id and not index of an array.

```
...
<form action="/fruits/<%=fruits[i].id%>?_method=DELETE" method="POST">
    <input type="submit" value="DELETE"/>
</form>
...
``` 

#### Update a Fruit (renderEdit() & editFruit())

To implement edit functionality we will update our function that renders the edit page and of course the function that updates data in the database.

Lets start with `renderEdit()`

Previously,

```
const renderEdit = (req, res) => {
    res.render(
		'edit.ejs',
		{ 
			fruit: fruits[req.params.index], 
			index: req.params.index 
		}
	);
}
```

Now,

```
const renderEdit = (req, res) => {
    Fruit.findByPk(req.params.index)
    .then(fruit => {
        res.render('edit.ejs', { 
            fruit: fruit
        });
    })
}
```

We will also update `edit.ejs` view to send `fruit.id` in url path as parameter instead of `index`.

```
...
	<form action="/fruits/<%=fruit.id%>?_method=PUT" method="POST">
...
```

Npw that we are sending the right fruit id we will update the `editFruit()` that updates the fruit in our database

Previously,

```
const editFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){ 
        req.body.readyToEat = true;
    } else { 
        req.body.readyToEat = false;
    }
	fruits[req.params.index] = req.body; 
	res.redirect('/fruits'); 
}
```

Now, 

```js
const editFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){ 
        req.body.readyToEat = true;
    } else { 
        req.body.readyToEat = false;
    }
    Fruit.update(req.body, {
          where: { id: req.params.index },
          returning: true,
        }
    )
    .then(fruit => {
        res.redirect('/fruits');
    })
}
```
Finally, we'll update the `index.js` to send `fruit.id` in url parameter.

```
...
	<a href="/fruits/<%=fruits[i].id%>/edit">Edit</a>
...
```

## Quick Recap

1. What files did `model:generate` create for us?
2. How will our app use the model file?
3. What are migrations used for?
4. What are the 4 folders that the Sequelize CLI created for us?
5. What do the `up` and `down` methods in our migration file do?
6. TRUE or FALSE: Generating a migration file automatically alters the schema of the database?

## Create User Model

### 1. Generate model

Lets use the Sequelize CLI `model:generate` command again to create a `User` model with `name`, `username` and `password` attributes:

`sequelize model:generate --name User --attributes name:string,username:string,password:string`

Just like before two files will be created- `models/user.js` and `migrations/XXXXXXX-create-user.js`. Just like earlier we'll add default values to `createdAt` and `updatedAt`.

```
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        defaultValue: new Date(),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: new Date(),
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
```

**Note:** We are making the `username` column **unique** and adding default value to `createdAt` and `updatedAt`.

### 2. Run Migrations

Now, we'll run the migrations to create `User` table in our database.

`sequelize db:migrate`

Just to confirm, let's go into the `psql` shell and confirm that a `Users` table has been created.

4. `\dt` - This will show the database tables 


### 3. Add seed data in User

`sequelize seed:generate --name demo-users`

Fill the empty seeders file.

```
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        name:'Tony Stark',
        username: 'ironman',
        password: 'prettyawesome'
      },
      {
        name:'Clark Kent',
        username: 'superman',
        password: `canfly`
      },
      {
        name:'Bruce Wayne',
        username: 'batman',
        password: 'hasgadgets'
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};

```

### 4. Run Seed file

Run `sequelize db:seed:all` to seed `Users` table.

#### Running a seed file

There are multiple ways of running a seed file

**sequelize db:seed:all** will run all the seed files, even the ones that have been run before.

**sequelize db:seed --seed XXXXXXXXX-demo-users.js** will run a specific seed file mentioned by name in the command

Confirm in `psql` by running `SELECT * FROM "Users";`

---------------------------

## Independent Practice: Update User Controller
Now that we have created our `User` model in the database. We will update the user controller such that all the functions use `User` model to do CRUD on user data.

Just like earlier, don't forget to import `User` model in `controllers/users.js`.

```
const User = require('../models').User;
```


<!--## Bonus

#### Add a column to the Database:

1. `sequelize migration:generate --name add-owner-to-pets`

```js
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Pets', 'owner', { type: Sequelize.STRING });
  },
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
```

1. `sequelize db:migrate`


## Undoing Migrations
Now our table has been created and saved in database. With migration you can revert to old state by just running a command.

You can use db:migrate:undo, this command will revert most recent migration.

npx sequelize-cli db:migrate:undo
You can revert back to initial state by undoing all migrations with db:migrate:undo:all command. You can also revert back to a specific migration by passing its name in --to option.

npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js-->
