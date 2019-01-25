import {mount} from 'enzyme';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {CURRENT_USER_QUERY} from '../components/User';
import PleaseSignIn from './../components/PleaseSignIn';
import {fakeUser} from '../lib/testUtils';

const notSignedInMocks = [
  {
    request: {query: CURRENT_USER_QUERY},
    result: {data: {me: null}},
  },
];

const signedInMocks = [
  {
    request: {query: CURRENT_USER_QUERY},
    result: {data: {me: fakeUser ()}},
  },
];

describe ('<PleaseSignIn />', () => {
  it ('renders the sign in dialog to logged out users', async () => {
    const wrapper = mount (
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    );
    await wait ();
    wrapper.update ();
    expect (wrapper.text ()).toContain ('Please Sign In Before Continuing');
    const SignIn = wrapper.find ('Signin');
    expect (SignIn.exists ()).toBe (true);
    // console.log (SignIn.debug ());
  });

  it ('renders the child component when the user is signed in', async () => {
    const Hey = () => <p>Hey!</p>;
    const wrapper = mount (
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <Hey />
        </PleaseSignIn>
      </MockedProvider>
    );

    // console.log (wrapper.debug ());
    await wait ();
    wrapper.update ();
    // console.log (wrapper.find('Signin'));
    // expect (wrapper.find ('Hey').exists ()).toBe (true); // this is just selecting selector 
    expect (wrapper.contains (<Hey />)).toBe (true); // this is give the actuall selector
  });
});
