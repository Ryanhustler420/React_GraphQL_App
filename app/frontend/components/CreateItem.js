import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import Form from './styles/Form';
import formMoney from '../lib/formatMoney';
import gql from 'graphql-tag';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

class CreateItem extends Component {
  state = {
    title: 'Cool Shoes',
    description: 'I love those Context',
    image: 'dog.jpeg',
    largeImage: 'large-dog.jpg',
    price: 1000,
  };

  handleChange = e => {
    const {name, type, value} = e.target;
    const val = type === 'number' ? parseFloat (value) : value;
    this.setState ({[name]: val});
  };

  render () {
    return (
      <Form
        onSubmit={e => {
          e.preventDefault ();
          console.log (this.state);
        }}
      >
        <fieldset>
          <label htmlFor="title">
            Title
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title"
              required
              value={this.state.title}
              onChange={this.handleChange}
            />
          </label>

          <label htmlFor="price">
            Price
            <input
              type="text"
              id="price"
              name="price"
              placeholder="Price"
              required
              value={this.state.price}
              onChange={this.handleChange}
            />
          </label>

          <label htmlFor="description">
            Description
            <textarea
              id="description"
              name="description"
              placeholder="Enter A Description"
              required
              value={this.state.description}
              onChange={this.handleChange}
            />
          </label>
          <button type="submit">Submit</button>
        </fieldset>
      </Form>
    );
  }
}

export default CreateItem;
export {CREATE_ITEM_MUTATION};
