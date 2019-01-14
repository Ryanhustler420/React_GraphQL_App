import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {perPage} from '../config';
import PaginationStyles from './styles/PaginationStyles';

const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({data, loading, error}) => {
      if (loading) return <p>Loading...</p>;
      const count = data.itemsConnection.aggregate.count;
      const pages = Math.ceil (count / perPage);
      debugger;
      const page = props.page;
      return (
        <PaginationStyles>
          <Head>
            <title>Sick Fits! - Page {page} of {pages}</title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: {page: page - 1},
            }}
          >
            <a className="prev" aria-disabled={page <= 1}> &larr; prev</a>
          </Link>
          <p>
            Page {props.page} of {pages}
          </p>
          <p>{count} Items Total</p>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: {page: page + 1},
            }}
          >
            <a className="prev" aria-disabled={page >= pages}> &rarr; next</a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
