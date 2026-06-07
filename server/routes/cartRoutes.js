const express = require('express');
const router = express.Router();
const { getCart, syncCart, updateCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCart).put(protect, updateCart).delete(protect, clearCart);
router.post('/sync', protect, syncCart);

module.exports = router;
