- [Completed Frontend](https://git.generalassemb.ly/Interapt/express-pet-app-frontend)
- [Completed Backend](https://git.generalassemb.ly/Interapt/express-pet-app-backend)


<br>

<br>

![](https://i.imgur.com/yvEYhnZ.png)

<br>

## Objectives

- Create CRUD API routes and methods for a single resource
- Connect Sequelize to an exisiting Postgres database
- Explain the advantages of using Sequelize vs writing SQL queries from scratch
- Learn to use Postman to test our routes before building a view
- Describe how to create a one to many relationship using Sequelize associations

<br>

## What is Sequelize?

[Sequelize](http://docs.sequelizejs.com/) is a promise-based ORM (Object Relational Mapper) for Node.js v4 and up. It supports the dialects PostgreSQL, MySQL, SQLite and MSSQL and features solid transaction support, relations, read replication and more.

With jQuery, we created jQuery objects that wrapped our DOM nodes with helpful methods and properties. Similarily, Sequelize creates objects that wrap our data in extra methods, properties and Promises. Additionally, since Sequelize is written in Javascript, we'll use Object Oriented Programming to create our SQL queries.

For example, to find all the instances of a user in a database:

```js
// SQL query 
SELECT * FROM users;

// Sequelize query
User.findAll()
```

Sequelize is super helpful when dealing with asynchronicity and associations (joins) between tables.

<br>

## Sequelize CLI

The Sequelize CLI (command line interface) makes it easy to add Sequelize to an existing app. 

- [Sequelize CLI GitHub](https://github.com/sequelize/cli)
- [Sequelize CLI Docs](http://docs.sequelizejs.com/manual/tutorial/migrations.html)


To install globally, run this Terminal command from any directory:

`npm install -g sequelize-cli`


#### Sequelize Init in an App

To use the Sequelize CLI we run `sequelize init` in the root directory of our app. This command will create the following files and folders:

![](https://i.imgur.com/5gyMcQv.png)

We'll be walking through these in more detail.

<br>

## Let's Build A New App for this lesson!

1. `express sequelize-express-lesson-app --ejs --git`
2. `cd` and `npm install`
- `npm install --save sequelize pg pg-hstore`
	- [`pg`](https://www.npmjs.com/package/pg) is the PostgreSQL client for Node.js. 
	- [`pg-hstore`](https://www.npmjs.com/package/pg-hstore) is a node package for serializing and deserializing JSON data to hstore format. It allows us to save non-relational data (objects) in a relational database.
- `createdb sequelize-express-lesson-app-development`
	- This is the Postgres database we'll create for this lesson
	- Make sure you run this from the command line *NOT* from inside `psql`  
	- How can we confirm that the database was created?
- `sequelize init`
	- This will create the files and folders listed above^^
- In our `package.json`, update the npm start script to `nodemon ./bin/www` 

<br>

## Configure database details

One of the files + folders that the Sequelize CLI created for us is `config/config.json`. Typically, we'd have 3 seperate databases for each environment (test, development, production). Why not use the same database for each?

Let's update the file to this:

```js
{
  "development": {
    "database": "sequelize-express-lesson-app-development",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

What did we change?

- _Optional_: We're only using a development database today so we removed the other environments.
- We deleted `username` and `password` fields because we don't need them today.
- We make sure the `database` value is the one we created.
- We change the dialect to `postgres` since that's the type of database we're using.

<br>

## Create a `User` model

Sequelize CLI created a `models/index.js` file for us. There is a lot of plumbing in here! Mainly, this file...

- Imports the Sequelize module once and shares it between all models we create
- Helps to set up associations between models
- DRYs up our code. Importing this one file will give us access to all models.

Let's use the Sequelize CLI `model:generate` command to create a User model with `firstName`, `lastName`, and `email` String attributes:


`sequelize model:generate --name user --attributes firstName:string,lastName:string,email:string`

- **IMPORTANT**: Make sure that there are **NO** spaces after the commas.

![](https://i.imgur.com/AMN35p4.png)

Two files were created for us the first is the `models/user.js` model file

<br>

#### `models/user.js`

Here is what the CLI generated for us:

```js
// models/user.js

'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
```

This file describes what attributes and methods each instance of a User should have in our database. How are attributes stored in our database?

<br>

#### `migrations/<TIMESTAMP>-create-user.js`

Migrations are how we manage the state of our database. Notice that each file is prefaced with a timestamp. You'll learn more about migrations tomorrow. Here's the file:

```js
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
```

This file tells the database to create a `users` table. It also defines each column's name and Sequelize datatype.

<br>


#### Run the Migrations

So far we've created a migration file, but our database has not recieved the instructions. We need to run our migrations folder to tell the database what we want it to look like. _You'll go over this more in depth tomorrow._ Let's run this command from the root directory of your app: 

`sequelize db:migrate` 

This will run our `create-user` migration file.

![](https://i.imgur.com/bakIvjv.png)

Just to confirm, let's go into the `psql` shell and confirm that a `users` table has been created.

1. `psql` - You can run this command from any directory to enter the Postgres shell
2. `\l` - See the list of databases
3. `\c sequelize-express-lesson-db-development` - Connect to our database	
4. `\dt` - This will show the database tables

<br>

## CFU

1. What files did `model:generate` create for us?
2. How will our app use the model file?
3. What are migrations used for?
4. What are the 4 folders that the Sequelize CLI created for us?
5. What do the `up` and `down` methods in our migration file do?
6. TRUE or FALSE: Generating a migration file automatically alters the schema of the database?

<br>

## Create database seeds for User

The last folder that Seqelize created for us is a seeders folder. This is where we can add seeds for our database. Why might seeds be useful?

Let's have the Sequelize CLI scaffold a timestamped file for `User` seeds in the seeders folder:

`sequelize seed:generate --name demo-users`

This created an empty seeders file. Fill it in like so:

```js
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {  
      return queryInterface.bulkInsert('users', [
        {
          firstName: 'Marc',
          lastName: 'Wright',
          email: 'marc@ga.co',
          createdAt: Sequelize.literal('NOW()'),
          updatedAt: Sequelize.literal('NOW()')
        },
        {
          firstName: 'Diesel',
          lastName: 'Wright',
          email: 'diesel@bark.co',
          createdAt: Sequelize.literal('NOW()'),
          updatedAt: Sequelize.literal('NOW()')
        }
      ], {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
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

Run `sequelize db:seed:all` to seed your `users` table.

##### Confirm in `psql`

Run `SELECT * FROM users;`

![](https://i.imgur.com/QzarwDy.png)

<br>

## Add Sequelize queries inside our routes

[Sequelize Queries](http://docs.sequelizejs.com/manual/tutorial/querying.html)

We'll use the exisiting `routes/users` controller that the Express Generator gave us to build out our Sequelize routes.

<br>

### Require the User model in the users controller

First things first, we need to let our controller know about the `User` model. We'll `require` the Sequelize `models/index.js` file. This file essentally `exports` an object that contains a property for each model.

```js
// At the top of the users controller

var User = require('../models').user
```

<br>

## Sequelize

[Docs](https://sequelize.org/master/)

1. `npm install sequelize sequelize-cli pg`
2. `sequelize init`
3. `config/config.json`

	```js
	{
	  "development": {
	    "database": "pets_app_development",
	    "host": "127.0.0.1",
	    "dialect": "postgres",
	    "operatorsAliases": false
	  },
	  "test": {
	    "database": "pets_app_test",
	    "host": "127.0.0.1",
	    "dialect": "postgres",
	    "operatorsAliases": false
	  },
	  "production": {
	    "database": "pets_app_production",
	    "host": "127.0.0.1",
	    "dialect": "postgres",
	    "operatorsAliases": false
	  }
	}
	```

4. `createdb pets_app_development`
5. `sequelize model:generate --name Pet --attributes name:string`
6. `sequelize db:migrate`

	![](https://i.imgur.com/GbVg6Uv.png)
	
<br>

## Create pet seeds

1. `sequelize seed:generate --name demo-pets`
2. Add this:

	```js
	'use strict';
	
	module.exports = {
	  up: (queryInterface, Sequelize) => {
	    return queryInterface.bulkInsert('Pets', [
	      {
	        name: 'Diesel',
	        createdAt: new Date(),
	        updatedAt: new Date()
	      },
	      {
	        name: 'Creamy',
	        createdAt: new Date(),
	        updatedAt: new Date()
	      },
	      {
	        name: 'Ravoli',
	        createdAt: new Date(),
	        updatedAt: new Date()
	      }], {});
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
3. `sequelize db:seed:all`

<br>

## Get All Pets

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

<br>

## Update React Frontend

1. Create new pet

```js
import React from 'react';
import './App.css';
import axios from 'axios';
const serverUrl = 'http://localhost:3000'

class App extends React.Component {
  state = {
    pets: [],
    newPet: ''
  }

  componentDidMount() {
    this.getPets()

  }

  getPets = () => {
    axios({
      url: `${serverUrl}/api/pets`,
      method: 'get'
    })
      .then(response => {
        console.log(response.data)
        this.setState({ pets: response.data.pets })
      })
  }

  handleChange = e => {
    this.setState({ newPet: e.target.value })
  }

  createPet = e => {
    e.preventDefault()
    let newPetObject = {
      petName: this.state.newPet
    }

    axios({
      url: `${serverUrl}/api/pets`,
      method: 'post',
      data: newPetObject
    })
      .then(response => {
        console.log(response.data)
        this.setState((prevState, currentState) => (
          { pets: [...prevState.pets, response.data.pet] }
        ))
      })
  }

  render() {
    console.log(this.state)
    const allPetEls = this.state.pets.map((pet, index) => {
      return <li key={index}>{pet.name || ''}</li>
    })
    return (
      <div className="App">
        <h1>Pets!</h1>
        <form onSubmit={this.createPet}>
          <input type="text" onChange={e => this.handleChange(e)} />
          <input type="submit" value="Create New Pet" />
        </form>
        <ul>
          {allPetEls}
        </ul>
      </div>
    );
  }
}

export default App;
```

## Delete Pet

![](https://i.imgur.com/K6Qn7dP.png)

```js
import React from 'react';
import './App.css';
import axios from 'axios';
const serverUrl = 'http://localhost:3000'

class App extends React.Component {
  state = {
    pets: [],
    newPet: ''
  }

  componentDidMount() {
    this.getPets()

  }

  deletePet = (e) => {
    e.preventDefault()
    let petToDeleteId = e.target.id
    console.log(petToDeleteId)
    axios({
      url: `${serverUrl}/api/pets/${petToDeleteId}`,
      method: 'delete'
    })
      .then(response => {
        console.log(response.data)
        this.setState({ pets: response.data.pets })
      })

  }

  getPets = () => {
    axios({
      url: `${serverUrl}/api/pets`,
      method: 'get'
    })
      .then(response => {
        console.log(response.data.pets)
        this.setState({ pets: response.data.pets })
      })
  }

  handleChange = e => {
    this.setState({ newPet: e.target.value })
  }

  createPet = e => {
    e.preventDefault()
    let newPetObject = {
      petName: this.state.newPet
    }

    axios({
      url: `${serverUrl}/api/pets`,
      method: 'post',
      data: newPetObject
    })
      .then(response => {
        console.log(response.data)
        this.setState((prevState, currentState) => (
          { pets: [...prevState.pets, response.data.pet] }
        ))
      })
  }

  render() {
    console.log(this.state)
    const allPetEls = this.state.pets.map((pet, index) => {
      return <li key={index}>
        {pet.name || ''}{'  '}
        <button id={pet.id} onClick={this.deletePet}>delete</button>
      </li>
    })
    return (
      <div className="App">
        <h1>Pets!</h1>
        <form onSubmit={this.createPet}>
          <input type="text" onChange={e => this.handleChange(e)} />
          <input type="submit" value="Create New Pet" />
        </form>
        <ul>
          {allPetEls}
        </ul>
      </div>
    );
  }
}

export default App;
```
