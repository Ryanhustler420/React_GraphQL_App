import React, {Component} from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';
import {perPage} from '../config';

const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
        items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
            id
            title
            price
            description
            image
            largeImage
        }
    }
`;

const Center = styled.div`
    text-align: center;
`;

const ItemsList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
`;

class Items extends Component {
  render () {
    return (
      <Center>
        <Pagination page={this.props.page} />
        <Query
          query={ALL_ITEMS_QUERY}
          // fetchPolicy="network-only" // fetch again for new data since after deleting an item it won't update so, 
          // you can use this is an helper
          // best would be to delete entire cache, but still if we do that then we will lose all data like, 
          // cart and account information. so as of now there is no solution at all may be in future.
          variables={{
            skip: this.props.page * perPage - perPage,
          }}
        >
          {payload => {
            const {data, error, loading} = payload;
            if (loading) return <p>Loading</p>;
            if (error) return <p>Error: {error.message}</p>;
            return (
              <ItemsList>
                {data.items.map (item => <Item key={item.id} item={item} />)}
              </ItemsList>
            );
          }}
        </Query>
        <Pagination page={this.props.page} />
      </Center>
    );
  }
}

export default Items;
export {ALL_ITEMS_QUERY};
