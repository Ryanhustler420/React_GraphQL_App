import {mount} from 'enzyme';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import Pagination, {PAGINATION_QUERY} from './../components/Pagination';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';

Router.router = {
  push () {},
  prefetch () {},
};

function makeMocksFor (length) {
  return [
    {
      request: {query: PAGINATION_QUERY},
      result: {
        data: {
          itemsConnection: {
            __typename: 'aggregate',
            aggregate: {
              __typename: 'count',
              count: length,
            },
          },
        },
      },
    },
  ];
}

describe ('<Pagination />', async () => {
  it ('displays a loading message', () => {
    const wrapper = mount (
      <MockedProvider mocks={makeMocksFor (1)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    const pagination = wrapper.find ('[data-test="pagination"]');
    expect (wrapper.text ()).toContain ('Loading...');
    // await wait();
    // wrapper.update();
    // expect(toJSON(pagination)).toMatchSnapshot();
    // console.log (wrapper.debug ());
  });

  it ('renders pagination for 18 items', async () => {
    const wrapper = mount (
      <MockedProvider mocks={makeMocksFor (18)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await wait ();
    wrapper.update ();
    expect (wrapper.find ('span.totalPages').text ()).toEqual ('5');
    const pagination = wrapper.find ('div[data-test="pagination"]');
    expect (toJSON (pagination)).toMatchSnapshot ();
    console.log (pagination.debug ());
  });

  it ('disables prev button on first page', async () => {
    const wrapper = mount (
      <MockedProvider mocks={makeMocksFor (18)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await wait ();
    wrapper.update ();
    expect (wrapper.find ('a.prev').prop ('aria-disabled')).toEqual (true);
    expect (wrapper.find ('a.next').prop ('aria-disabled')).toEqual (false);
  });

  it ('disables prev button on last page', async () => {
    const wrapper = mount (
      <MockedProvider mocks={makeMocksFor (18)}>
        <Pagination page={5} />
      </MockedProvider>
    );
    await wait ();
    wrapper.update ();
    expect (wrapper.find ('a.prev').prop ('aria-disabled')).toEqual (false);
    expect (wrapper.find ('a.next').prop ('aria-disabled')).toEqual (true);
  });

  it ('disables prev button on middle page', async () => {
    const wrapper = mount (
      <MockedProvider mocks={makeMocksFor (18)}>
        <Pagination page={3} />
      </MockedProvider>
    );
    await wait ();
    wrapper.update ();
    expect (wrapper.find ('a.prev').prop ('aria-disabled')).toEqual (false);
    expect (wrapper.find ('a.next').prop ('aria-disabled')).toEqual (false);
  });
});
