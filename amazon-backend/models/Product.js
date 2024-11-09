const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    stars: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  },
  priceCents: {
    type: Number,
    required: true
  },
  keywords: [String],
  type: String,
  sizeChartLink: String
});

// Add basic index for common searches
productSchema.index({ name: 1 });

module.exports = mongoose.model('Product', productSchema); 