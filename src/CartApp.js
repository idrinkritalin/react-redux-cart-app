import React, { Component } from 'react';
import './CartApp.css';
import ReactLoading from 'react-loading';
import { checkStatus } from './utils/checkStatus';
import Header from './components/Header';
import ProductsGrid from './components/ProductsGrid';
import Modal from 'react-awesome-modal';

class CartApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cart: [],
      products : [],
      isLoaded : false,
      isModalVisible : false,
    }

    this.addToCart = this.addToCart.bind(this);
  }

  addToCart(item) {
    item.qty !== 0 ? (
      this.setState({
        cart: [...this.state.cart, item]
      })
    ) : (
      this.setState({ isModalVisible: true })
    )
  }

  closeModal() {
    this.setState({ isModalVisible : false });
  }

  componentDidMount() {
    const server = 'http://localhost:4000/products'

    fetch(server)
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        this.setState({products:json, isLoaded:true});
      });
  }

  render() {
    const { cart, products, isLoaded, isModalVisible } = this.state
    return (
      <div className="CartApp">
        <Header
          cartedItems={cart}
        />

        { isLoaded ? (
          <ProductsGrid
            products={products}
            onAddToCart={this.addToCart}
          />
        ) : (
          <div className="loading-spin">
            <ReactLoading type='spin' color='#299ABF' height='50' width='50' />
            <p>Loading products...</p>
          </div>
        ) }

        <Modal visible={isModalVisible} width="400" height="110" effect="fadeInUp" onClickAway={() => this.closeModal()}>
          <div id="modal-warning">
              <p>Unfortunately the product is 'Out Of Stock'</p>
              <a href="#" onClick={() => this.closeModal()}>&times;</a>
          </div>
        </Modal>

      </div>
    );
  }
}

export default CartApp;
