import {Query} from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const ALL_USERS_QUERY = gql`
    query {
        users {
            id
            name
            email
            permission
        }
    }
`;

const PermissionsComponent = props => (
  <Query query={ALL_USERS_QUERY}>
    {({data, loading, error} /* console.log(data)  || */) => (
      <div>
        <Error error={error} />
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map (permission => (
                  <th key={permission}>{permission}</th>
                ))}
                <th>&darr;</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map (user => (
                <UserPermission key={user.name} user={user} />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
);

class UserPermission extends React.Component {
  static propTypes = {
    user: PropTypes.shape ({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permission: PropTypes.array,
    }).isRequired,
  };

  state = {
    permissions: this.props.user.permission,
  };

  handlePermissionChange = e => {
    //   console.log(e.target.value);
    //   console.log(e.target.checked);
    const checkbox = e.target;
    // take a copy of the current permission
    let updatedPermissions = [...this.state.permissions];
    // figure out if we need to remove or add this permission
    if (checkbox.checked) {
      // add it in!
      updatedPermissions.push (checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter (
        permission => permission !== checkbox.value
      );
    }
    this.setState ({permissions: updatedPermissions});
  };

  render () {
    const user = this.props.user;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map (permission => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                type="checkbox"
                checked={this.state.permissions.includes (permission)}
                value={permission}
                onChange={this.handlePermissionChange}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    );
  }
}

export default PermissionsComponent;
