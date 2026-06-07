const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');




const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      res.status(400);
      throw new Error('No items in order');
    }

    
    const orderItems = [];
    let itemsPrice = 0;

    for (const item of cartItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.product}`);
      }

      
      let variantData = null;
      let price = product.basePrice;

      if (item.variant?.sku) {
        variantData = product.variants.find((v) => v.sku === item.variant.sku);
        if (variantData) {
          price = variantData.price;

          
          if (variantData.stock < item.quantity) {
            res.status(400);
            throw new Error(
              `Insufficient stock for ${product.name} (${variantData.size}/${variantData.color}). Available: ${variantData.stock}`
            );
          }

          
          variantData.stock -= item.quantity;
          await product.save();
        }
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        variant: item.variant || {},
        price: price,
        quantity: item.quantity,
      });

      itemsPrice += price * item.quantity;
    }

    const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100; 
    const shippingPrice = itemsPrice > 500 ? 0 : 49;
    const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'Pending',
    });

    
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};




const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};




const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};




const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};




const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = req.body.status;
    if (req.body.status === 'Paid') {
      order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
