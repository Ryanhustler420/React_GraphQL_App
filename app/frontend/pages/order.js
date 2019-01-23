import PleaseSignIn from './../components/PleaseSignIn';

const OrderPage = props => (
  <div>
    <PleaseSignIn>
      <p>This is a single Order! {props.query.id}</p>
    </PleaseSignIn>
  </div>
);

export default OrderPage;
