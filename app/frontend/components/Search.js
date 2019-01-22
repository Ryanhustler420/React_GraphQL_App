import React from 'react';
import Downshift from 'downshift';
import Router from 'next/router';
import {ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import {DropDown, DropDownItem, SearchStyles} from './styles/DropDown';

class AutoComplete extends React.Component {
  render () {
    return (
      <SearchStyles>
        <div>
          <input type="search" />
          <DropDown>
            <p>Items will go here</p>
          </DropDown>
        </div>
      </SearchStyles>
    );
  }
}
export default AutoComplete;
