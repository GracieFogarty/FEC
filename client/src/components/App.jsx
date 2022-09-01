/* eslint-disable import/extensions */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';
// import config from '../../../config.js';
import Overview from './Overview/index.jsx';
import QA from './QA/index.jsx';
import RelatedItems from './RelatedItems/index.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      currentProduct: [],
    };
  }

  componentDidMount() {
    axios.get('/products')
      .then((response) => (
        this.setState({
          products: response.data,
          currentProduct: response.data[0],
        })
      ))
      .catch((err) => (
        console.log('ERROR GETTING PRODUCTS IN APP.JSX', err)
      ));
  }

  render() {
    return (
      <div>
        <div id="main">
          <Overview product={this.state.currentProduct} />
        </div>
        <div>
          <RelatedItems products={this.state.products} currentProduct={this.state.currentProduct} />
        </div>
        <div>
          <QA />
        </div>
      </div>
    );
  }
}

export default App;
