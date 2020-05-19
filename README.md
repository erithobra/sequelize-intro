
![](https://i.imgur.com/yvEYhnZ.png)

<br>

## Objectives

- Create CRUD API routes and methods for a single resource
- Connect Sequelize to an exisiting Postgres database
- Explain the advantages of using Sequelize vs writing SQL queries from scratch
- Learn to use Postman to test our routes before building a view


<br>

## What is Sequelize?

[Sequelize](http://docs.sequelizejs.com/) is a promise-based ORM (Object Relational Mapper) for Node.js v4 and up. It supports the dialects PostgreSQL, MySQL, SQLite and MSSQL and features solid transaction support, relations, read replication and more.

Sequelize creates objects that wrap our data in extra methods, properties and Promises. Additionally, since Sequelize is written in Javascript, we'll use Object Oriented Programming to create our SQL queries.

For example, to find all the instances of a user in a database:

```js
// SQL query 
SELECT * FROM fruits;

// Sequelize query
Fruit.findAll()
```

Sequelize is super helpful when dealing with asynchronicity and associations (joins) between tables. We'll talk about it more later.

<br>

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
Sequelize CLI [Node: 12.16.3, CLI: 5.5.1, ORM: 5.21.9]sequelize [command]Commands:  sequelize db:migrate                        Run pending migrations  sequelize db:migrate:schema:timestamps:add  Update migration table to have timestamps  sequelize db:migrate:status                 List the status of all migrations  sequelize db:migrate:undo                   Reverts a migration  sequelize db:migrate:undo:all               Revert all migrations ran  sequelize db:seed                           Run specified seeder  sequelize db:seed:undo                      Deletes data from the database  sequelize db:seed:all                       Run every seeder  sequelize db:seed:undo:all                  Deletes data from the database  sequelize db:create                         Create database specified by configuration  sequelize db:drop                           Drop database specified by configuration  sequelize init                              Initializes project  sequelize init:config                       Initializes configuration  sequelize init:migrations                   Initializes migrations  sequelize init:models                       Initializes models  sequelize init:seeders                      Initializes seeders  sequelize migration:generate                Generates a new migration file                 [aliases: migration:create]  sequelize model:generate                    Generates a model and its migration                [aliases: model:create]  sequelize seed:generate                     Generates a new seed file                           [aliases: seed:create]Options:  --help     Show help                                                                                         [boolean]  --version  Show version number                                                                               [boolean]
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
{  "development": {    "username": "postgres",    "password": "postgres",    "database": "fruits_dev",    "host": "127.0.0.1",    "dialect": "postgres",    "operatorsAliases": false  }}
```

What did we change?

- _Optional_: We're only using a development database today so we removed the other environments.
- We make sure the `database` value is the one we created.
- We change the dialect to `postgres` since that's the type of database we're using.

<br>

4. Go back to cmd prompt and connect to postgres

```
psql -U postgres

postgres=# CREATE DATABASE fruits_dev;
CREATE DATABASE
```

#### Create a `Fruit` model

Sequelize CLI created a `models/index.js` file for us. There is a lot of plumbing in here! Mainly, this file...

- Imports the Sequelize module once and shares it between all models we create
- Helps to set up associations between models
- DRYs up our code. Importing this one file will give us access to all models.

Let's use the Sequelize CLI `model:generate` command to create a Pet model with `name` and `owner` String attributes:


`sequelize model:generate --name Fruit --attributes name:string,color:string,readyToEat:boolean`

- **IMPORTANT**: Make sure that there are **NO** spaces after the commas.

Two files were created for us the first is the `models/fruit.js` model file.

```js
'use strict';module.exports = (sequelize, DataTypes) => {  const Fruit = sequelize.define('Fruit', {    name: DataTypes.STRING,    color: DataTypes.STRING,    readyToEat: DataTypes.BOOLEAN  }, {});  Fruit.associate = function(models) {    // associations can be defined here  };  return Fruit;};
```

This file describes what attributes and methods each instance of a `Fruit` should have in our database. How are attributes stored in our database?

#### `migrations/<TIMESTAMP>-create-fruit.js`

Migrations are how we manage the state of our database. Notice that each file is prefaced with a timestamp. You'll learn more about migrations tomorrow. Here's the file:

```js
'use strict';module.exports = {  up: (queryInterface, Sequelize) => {    return queryInterface.createTable('Fruits', {      id: {        allowNull: false,        autoIncrement: true,        primaryKey: true,        type: Sequelize.INTEGER      },      name: {        type: Sequelize.STRING      },      color: {        type: Sequelize.STRING      },      readyToEat: {        type: Sequelize.BOOLEAN      },      createdAt: {        allowNull: false,        type: Sequelize.DATE      },      updatedAt: {        allowNull: false,        type: Sequelize.DATE      }    });  },  down: (queryInterface, Sequelize) => {    return queryInterface.dropTable('Fruits');  }};
```

This file tells the database to create a `fruits` table. It also defines each column's name and Sequelize datatype.


#### Run the Migrations

So far we've created a migration file, but our database has not recieved the instructions. We need to run our migrations folder to tell the database what we want it to look like. Let's run this command from the root directory of your app: 

`sequelize db:migrate` 

```
Sequelize CLI [Node: 12.16.3, CLI: 5.5.1, ORM: 5.21.9]Loaded configuration file "config\config.json".Using environment "development".(node:11100) [SEQUELIZE0004] DeprecationWarning: A boolean value was passed to options.operatorsAliases. This is a no-op with v5 and should be removed.== 20200518203858-create-fruit: migrating ========= 20200518203858-create-fruit: migrated (0.058s)
```

This will run our `create-fruit` migration file.

Just to confirm, let's go into the `psql` shell and confirm that a `pets` table has been created.

1. `psql` - You can run this command from any directory to enter the Postgres shell
2. `\l` - See the list of databases
3. `\c fruits_dev` - Connect to our database
4. `\dt` - This will show the database tables


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



<br>

## CFU

1. What files did `model:generate` create for us?
2. How will our app use the model file?
3. What are migrations used for?
4. What are the 4 folders that the Sequelize CLI created for us?
5. What do the `up` and `down` methods in our migration file do?
6. TRUE or FALSE: Generating a migration file automatically alters the schema of the database?
	
<br>

## Create database seeds for Pet

The last folder that Seqelize created for us is a seeders folder. This is where we can add seeds for our database. Why might seeds be useful?

Let's have the Sequelize CLI scaffold a timestamped file for `Pet` seeds in the seeders folder:

`sequelize seed:generate --name demo-pets`

This created an empty seeders file. Fill it in like so:

```js
'use strict';
	
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Pets', [
      {
        name: 'Diesel',
        breed: 'Terrier',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Creamy',
        breed: 'cat',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ravoli',
        breed: 'cat',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },
	
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
	
      Example:
      return queryInterface.bulkDelete('Pets', null, {});
    */
  }
};
```

<br>

#### What's going on here!?

- When we run this seeders file, the `up` method will run. If we ever want to undo or rollback these seeds, the `down` method will run.
- `queryInterface.bulkInsert` is an efficent Sequelize method to dump an array of objects into our database all at once.
- We're also adding some `createdAt` and `updatedAt` fields since those are required.

<br>

##### Seed your Database Table

Run `sequelize db:seed:all` to seed your `pets` table.

##### Confirm in `psql`

Run `SELECT * FROM pets;`

<br>

### Require the Pet model in the pets routes file

First things first, we need to let our routes file know about the `Pet` model. We'll `require` the Sequelize `models/index.js` file. This file essentally `exports` an object that contains a property for each model.

```js
// At the top of the pets routes file

const Pet = require('../models').Pet
```

<br>

## Get All Pets

[Sequelize Queries](http://docs.sequelizejs.com/manual/tutorial/querying.html)
[Sequelize Docs](https://sequelize.org/master/manual/models-usage.html)

`routes/pets.js`:

```js
// DELETE const pets = []
const Pet = require('./models').Pet
	
/* GET pets */
router.get('/', (req, res) => {
  Pet.findAll()
    .then(pets => {
      res.json({ pets });
    })
});
```
	
![](https://i.imgur.com/gWM55YT.png)

<br>

## Get one pet

[Sequelize Docs](https://sequelize.org/master/manual/models-usage.html)

`routes/pets.js`:

```js
/* GET one pet */
router.get('/:id', (req, res) => {
  Pet.findByPk(req.params.id)
    .then(pet => {
      res.json({ pet })
    })
})
```

![](https://i.imgur.com/GzKDlPu.png)

<br>

## Create a pet


[Sequelize Docs](https://sequelize.org/master/manual/models-usage.html)

`routes/pets.js`:

```js
/* CREATE a pet */
router.post('/', (req, res) => {
  Pet.create(req.body)
    .then(pet => {
      res.json({ pet })
    })
})
```

![](https://i.imgur.com/RN7tX30.png)

<br>

## Delete a pet

[Sequelize Docs](https://sequelize.org/master/manual/querying.html#basics)

`routes/pets.js`:

```js
/* DELETE a pet */
router.delete('/:id', (req, res) => {
  Pet.destroy({ where: { id: req.params.id } })
    .then(() => {
      return Pet.findAll()
    })
    .then(pets => {
      res.json({ pets })
    })
})
```

![](https://i.imgur.com/ieR0mDy.png)

<br>

## Update a pet

[Sequelize Docs](https://sequelize.org/master/manual/querying.html#basics)

`routes/pets.js`:

```js
/* UPDATE a pet */
router.put('/:id', (req, res) => {
  console.log(req.body)
  Pet.update({ name: req.body.name },
    {
      where: { id: req.params.id },
      returning: true,
    })
    .then(pet => {
      res.json(pet)
    })
})
```

![](https://i.imgur.com/7k9A1we.png)