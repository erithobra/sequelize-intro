import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
const serverUrl = 'http://localhost:3000/api';

class App extends Component {
  state = {
    pets: [],
    newPet: {},
    owners: []
  }

  componentDidMount() {
    this.getPets()
    this.getOwners()
  }

  getOwners = () => {
    axios({
      url: `${serverUrl}/owners`,
      method: 'get'
    })
      .then(response => {
        this.setState({ owners: response.data.owners })
      })
  }

  getPets = () => {
    axios({
      url: `${serverUrl}/pets`,
      method: 'get'
    })
      .then(response => {
        this.setState({
          pets: response.data.pets
        })
      })
  }

  createPet = e => {
    e.preventDefault()
    axios({
      url: `${serverUrl}/pets`,
      method: 'post',
      data: { newPet: this.state.newPet }
    })
      .then(response => {
        this.setState(prevState => (
          {
            pets: [...prevState.pets, response.data.pet]
          }
        ))
      })
  }

  handleChange = e => {
    let newPet = {
      [e.target.name]: e.target.value
    }

    this.setState((prevState, currentState) => (
      { newPet: { ...prevState.newPet, ...newPet } }
    ))
  }

  deletePet = e => {
    axios({
      url: `${serverUrl}/pets/${e.target.id}`,
      method: 'delete'
    })
      .then(response => {
        this.setState({ pets: response.data.pets })
      })
  }

  deleteOwner = e => {
    axios({
      url: `${serverUrl}/owners/${e.target.id}`,
      method: 'delete'
    })
      .then(response => {
        this.setState({ owners: response.data.owners })
      })
  }

  render() {
    console.log(this.state)
    const petEls = this.state.pets.map(pet => {
      return <li key={pet.id}>
        {pet.name} -- {pet.breed}
        <button id={pet.id} onClick={this.deletePet}>delete pet</button>
      </li>
    })

    const ownerEls = this.state.owners.map(owner => {
      return <li key={owner.id}>
        {owner.firstName}--{owner.lastName}
        <button id={owner.id} onClick={this.deleteOwner} >delete owner</button>
      </li>
    })

    return (
      <div className="App" >
        <h1>Pets!</h1>
        <form onSubmit={this.createPet} onChange={e => this.handleChange(e)}>
          Name: <input type='text' name='name' />
          Breed: <input type='text' name='breed' />
          <input type='submit' value='New Pet' />
        </form>
        <div id='outerDiv'>
          <div id='pets'>
            <h2>Pets</h2>
            <ul>
              {petEls}
            </ul>
          </div>
          <div id='owners'>
            <h2>Owners</h2>
            <ul>
              {ownerEls}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
