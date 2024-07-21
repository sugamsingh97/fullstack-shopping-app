import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'accepted', 'declined', 'delivered'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);
// this is a pre-save hook that calculates the total amount of the order.

const Order = mongoose.model('Order', orderSchema);
export default Order;
