import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sizes from './Sizes.jsx';
import Quantities from './Quantities.jsx';

function SelectionForm({ stock, updateCart }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantityOptions, setQuantityOptions] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState([]);
  const [stockLoaded, setStockLoaded] = useState(false);

  //checks that data has been passed down as props
  useEffect(() => {
    if (stock) {
      setStockLoaded(true);
    }
  }, [stock]);

  //sets selected size and updates the quantity available for selected size
  const handleSizeSelect = (newSku) => {
    setSelectedSize(newSku);
    const quantities = [];
    for (let i = 0; i < stock.length; i++) {
      if (stock[i][0] === newSku) {
        const quantitiesMax = stock[i][1].quantity;
        for (let j = 1; j <= quantitiesMax; j++) {
          quantities.push(j);
        }
        const max15 = quantities.slice(0, 15);
        setQuantityOptions(max15);
        setSelectedQuantity(1);
      }
    }
  };

  //sets selected quantity
  const handleQuantitySelect = (newQuantity) => {
    setSelectedQuantity(newQuantity);
  };

  //sends selected product, size, and quantity to cart
  const addToCart = (event) => {
    event.preventDefault();
    for (let i = 1; i <= selectedQuantity; i++) {
      axios.post('/cart', { sku_id: selectedSize })
        .then(() => axios.get('/cart')
          .then((response) => updateCart(response.data)))
        .catch((err) => console.log(err));
    }
  };

  //if product is out of stock, disables selections and displays out of stock
  if (stockLoaded) {
    if (!stock[0][1].size) {
      return (
        <div>
          <select name="size" id="size" defaultValue="Select Size">
            <option value="">OUT OF STOCK</option>
          </select>
        </div>
      );
    }

    //if no size is selected, disables the add to cart button until a size and quantity are selected
    if (!selectedSize) {
      return (
        <div className="selection-form">
          <select name="size" id="size" onChange={(e) => handleSizeSelect(e.target.value)}>
            <option value="">SELECT SIZE</option>
            {stock.map((sizes) => (
              <Sizes
                key={sizes[1].quantity}
                size={sizes[1].size}
                sku={sizes[0]}
                handleSizeSelect={handleSizeSelect}
              />
            ))}
          </select>
          <select name="quantity" id="quantity">
            <option>      -     </option>
            {quantityOptions.map((quantity) => (
              <Quantities quantity={quantity} />
            ))}
          </select>
          <br />
          <button disabled type="submit" id="submit">ADD TO CART</button>
        </div>
      );
    }
    return (
      <div className="selection-form">
        <select name="size" id="size" onChange={(e) => handleSizeSelect(e.target.value)}>
          <option value="">SELECT SIZE</option>
          {stock.map((sizes) => (
            <Sizes
              key={sizes[1].quantity}
              size={sizes[1].size}
              sku={sizes[0]}
              handleSizeSelect={handleSizeSelect}
            />
          ))}
        </select>
        <select name="quantity" id="quantity" onChange={(e) => handleQuantitySelect(e.target.value)}>
          {quantityOptions.map((quantity) => (
            <Quantities quantity={quantity} />
          ))}
        </select>
        <br />
        <button id="submit" type="submit" onClick={(e) => addToCart(e)}>ADD TO CART</button>
      </div>
    );
  }
}

export default SelectionForm;
