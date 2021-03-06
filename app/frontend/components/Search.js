import React from 'react';
import Downshift, {resetIdCounter} from 'downshift';
import Router from 'next/router';
import {ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import {DropDown, DropDownItem, SearchStyles} from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchTerm: String!){
        items(where: {
            OR: [   { title_contains: $searchTerm },
                    { description_contains: $searchTerm }
                ] 
            }) {
            id
            image
            title
        }
    }
`;

// https://blog.kentcdodds.com/introducing-downshift-for-react-b1de3fca0817

function routeToItem (item) {
  //   console.log (item);
  Router.push ({
    pathname: '/item',
    query: {
      id: item.id,
    },
  });
}

class AutoComplete extends React.Component {
  state = {
    items: [],
    loading: false,
  };

  onChange = debounce (async (e, client) => {
    // turn loading on before fetching data from server
    this.setState ({loading: true});
    // Manually query apollo client
    const res = await client.query ({
      query: SEARCH_ITEMS_QUERY,
      variables: {searchTerm: e.target.value},
    });
    this.setState ({items: res.data.items, loading: false});
  }, 350);
  render () {
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift
          onChange={routeToItem}
          itemToString={item => (item === null ? '' : item.title)}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex,
          }) => (
            <div>
              {/* ApolloConsumer provdes us to manually call the function of apollo client and not only when the page loades  */}
              <ApolloConsumer>
                {client => (
                  <input
                    type="search"
                    {...getInputProps ({
                      type: 'search',
                      placeholder: "Search for ex. ' bag '",
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: e => {
                        e.persist ();
                        this.onChange (e, client);
                      },
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen &&
                <DropDown>
                  {this.state.items.map ((item, i) => (
                    <DropDownItem
                      {...getItemProps ({item})}
                      key={item.id}
                      highlighted={i === highlightedIndex}
                    >
                      <img width="50" alt={item.title} src={item.image} />
                      {item.title}
                    </DropDownItem>
                  ))}
                </DropDown>}

              {!this.state.items &&
                !this.state.loading &&
                <DropDown>
                  Nothing Found {inputValue}
                </DropDown>}

            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}
export default AutoComplete;
