const User = require('../models/User');




const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product', 'name images basePrice variants');
    res.json(user.cart || []);
  } catch (error) {
    next(error);
  }
};




const syncCart = async (req, res, next) => {
  try {
    const { cartItems } = req.body; 
    const user = await User.findById(req.user._id);

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.json(user.cart || []);
    }

    
    for (const guestItem of cartItems) {
      const existingIndex = user.cart.findIndex(
        (dbItem) =>
          dbItem.product.toString() === guestItem.product &&
          dbItem.variant?.sku === guestItem.variant?.sku
      );

      if (existingIndex > -1) {
        
        user.cart[existingIndex].quantity = Math.max(
          user.cart[existingIndex].quantity,
          guestItem.quantity
        );
      } else {
        
        user.cart.push({
          product: guestItem.product,
          variant: guestItem.variant,
          quantity: guestItem.quantity,
        });
      }
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cart.product', 'name images basePrice variants');
    res.json(updatedUser.cart);
  } catch (error) {
    next(error);
  }
};




const updateCart = async (req, res, next) => {
  try {
    const { cartItems } = req.body;
    const user = await User.findById(req.user._id);

    user.cart = cartItems.map((item) => ({
      product: item.product,
      variant: item.variant,
      quantity: item.quantity,
    }));

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cart.product', 'name images basePrice variants');
    res.json(updatedUser.cart);
  } catch (error) {
    next(error);
  }
};




const clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, syncCart, updateCart, clearCart };
