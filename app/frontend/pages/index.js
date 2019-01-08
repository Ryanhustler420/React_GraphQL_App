// import React, { Component } from 'react'

// export default class Home extends Component {
//   render() {
//     return (
//       <div>
//         Hey!
//       </div>
//     )
//   }
// }

// need not to be statefull component
// And next.js will handle import 'react' so we dont need to explicitly write import 'react'
// import React from 'react'
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <p>Hey</p>
    </div>
  );
};

export default Home;
