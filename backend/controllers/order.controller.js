import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

// when client adds products for the first time, we create a new order
export const addToOrder = async (req, res) => {
  try {
    // check user role and return asap error if he is not client
    if (req.user.userRole !== 'client') {
      return res
        .status(401)
        .json({ error: 'Only Clients can add products to their orders.' });
    }

    // deconstruction of user object to exteact id
    const currentUserId = req.user._id;

    // deconstruction of req body to extract product id and quantity
    const { newProductId, quantity } = req.body;
    const newQuantity = parseInt(quantity);

    // we are declaring a new order object with 'let' keyword
    let order = await Order.findOne({ userId: currentUserId, status: 'draft' });

    // we are finding the one order where the user id is equal to the current user id AND the order status is 'draft'
    if (!order) {
      // if such order does not exist, we are creating a new order
      order = new Order({
        userId: currentUserId,
        products: [
          {
            productId: newProductId,
            quantity: newQuantity,
          },
        ],
      });
    } else {
      // Find the index of the product in the order
      const productIndex = order.products.findIndex(
        (product) => product.productId.toString() === newProductId
      );

      if (productIndex !== -1) {
        // If the product exists, update its quantity
        order.products[productIndex].quantity += newQuantity;
      } else {
        // else we are pushing the product to the orderList
        order.products.push({
          productId: newProductId,
          quantity: newQuantity,
        });
      }
    }

    // we save the order
    order.totalAmount = await calculateTotalAmount(order);
    const newOrderCreated = await order.save();

    //we return the saved order
    return res.status(201).json({
      message: 'Product added to the order successfully',
      order: newOrderCreated,
    });
  } catch (error) {
    //if there is an error, log it and send a response
    console.log('Error in add new products or order controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

// owner has right to see all the orders
export const getAllOrders = async (req, res) => {
  try {
    // check user role and return asap error if user is not owner
    if (req.user.userRole !== 'owner') {
      return res.status(401).json({
        error: 'Only Owner can view order lists.',
      });
    }

    // we are finding all the orders and storing them on a variable
    const orderList = await Order.find();

    // if the orderList is not empty, we are sending it as a response
    if (orderList?.length > 0) {
      return res.status(200).json(orderList);
    } else {
      return res.status(204).json({
        error: 'No orders found',
      });
    }
  } catch (error) {
    console.log('Error in get all orders controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

// clients can only see their orders
export const getAllClientOrders = async (req, res) => {
  try {
    //get the user id
    const currentUserId = req.user._id;

    //find the orders where user id is the id and store it on a list
    const userOrderList = await Order.find({ userId: currentUserId });

    //if the list is not empty, we are sending it as a response
    if (userOrderList?.length > 0) {
      return res.status(200).json(userOrderList);
    } else {
      return res.status(204).json({
        error: 'No orders found because this client does not have any orders.',
      });
    }
  } catch (error) {
    console.log('Error in get all client orders controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

// client gets its order with  'draft' status
export const getCurrentOrder = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentOrder = await Order.findOne({
      userId: currentUserId,
      status: 'draft',
    });
    if (!currentOrder) {
      return res.status(404).json({
        error: 'No current order found for this client',
      });
    }

    res.status(200).json(currentOrder);
  } catch (error) {
    console.log('Error in get current order controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

// client updating the order quantity
export const updateOrder = async (req, res) => {
  try {
    if (req.user.userRole !== 'client') {
      return res.status(401).json({
        error: 'Only clients can update orders',
      });
    }

    // deconstruction of req body to extract order id, product id and new quantity
    const { orderId, productId, newQuantity } = req.body;

    // find the order by id
    const orderToUpdate = await Order.findById(orderId);
    if (!orderToUpdate) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    // finding the product to update from the orderList
    for (const product of orderToUpdate.products) {
      if (product.productId.toString() === productId.toString()) {
        product.quantity = newQuantity;
      }
    }

    // call the function
    orderToUpdate.totalAmount = await calculateTotalAmount(orderToUpdate);
    const updatedOrder = await orderToUpdate.save();
    return res.status(200).json({
      updatedOrder,
    });
  } catch (error) {
    console.log('Error in update order controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

// update the order status
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    // find the order by id
    const orderToUpdate = await Order.findById(orderId);
    if (!orderToUpdate) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }
    // check if the user is a client and the status is not submitted
    // clients can only update the status to submitted
    if (req.user.userRole === 'client' && status !== 'submitted') {
      return res.status(401).json({
        error: 'Clients can not update orders',
      });
    }

    // cheick if the role is client and the status is submitted
    if (req.user.userRole === 'client' && status === 'submitted') {
      orderToUpdate.status = status;
    }

    // check if the role is owner and the status is not submitted
    if (req.user.userRole === 'owner' && status !== 'submitted') {
      if (
        status === 'accepted' ||
        status === 'declined' ||
        status === 'delivered'
      )
        orderToUpdate.status = status;
    }
    const updatedOrder = await orderToUpdate.save();
    return res.status(200).json({
      updatedOrder,
    });
  } catch (error) {
    console.log('Error in update order STATUS controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

// function to calculate the total amount of the order
const calculateTotalAmount = async (orderToUpdate) => {
  let totalAmount = 0;
  for (const product of orderToUpdate.products) {
    const originalProduct = await Product.findById(product.productId);
    if (originalProduct) {
      totalAmount += originalProduct.price * product.quantity;
    }
  }
  return totalAmount.toFixed(2);
};
