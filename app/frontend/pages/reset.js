import Reset from './../components/Reset';

const ResetPage = props => (
  <div>
    <Reset resetToken={props.query.resetToken} />
  </div>
);

export default ResetPage;

// http://localhost:7777/reset?resetToken=0fd580ecb4da6d8b0fd7554eed21914f2d5c94
