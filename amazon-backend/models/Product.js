const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: String,
  image: String,
  name: String,
  rating: {
    stars: Number,
    count: Number
  },
  priceCents: Number,
  keywords: [String],
  type: {
    type: String,
    default: null
  },
  sizeChartLink: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Product', productSchema); 