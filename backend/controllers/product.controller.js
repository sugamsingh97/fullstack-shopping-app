import Product from '../models/product.model.js';

//add a new product by the owner
export const addProduct = async (req, res) => {
  try {
    //we access the current authticated user from the request and not response be careful
    //check the role property of the user
    const checkRole = req.user.userRole === 'owner';

    //deconstructing the request body
    const { name, price, description, image, quantity } = req.body;

    //validating if all the fields are provided
    if (!name || !price || !description || !image || !quantity) {
      return res.status(400).json({
        error: 'Please provide all the required fields',
      });
    }

    //creating a new product object
    const newProduct = new Product({
      name,
      price,
      description,
      image,
      quantity,
    });

    //saving the new product only if the user is an owner
    if (newProduct && checkRole) {
      await newProduct.save();
      return res.status(201).json({
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        image: newProduct.image,
        quantity: newProduct.quantity,
      });
    } else {
      return res.status(401).json({
        error: 'Only Owner can add products',
      });
    }
  } catch (error) {
    console.log(
      'Something went wrong in add product controller',
      error.message
    );
    return res.status(500).json({
      error: 'Something went wrong in add product controller',
    });
  }
};

//get all products
export const getAllProducts = async (req, res) => {
  try {
    const productList = await Product.find();
    if (productList.length > 0) {
      return res.status(200).json(productList);
    } else {
      return res.status(404).json({
        error: 'No products found',
      });
    }
  } catch (error) {
    console.log(
      'Something went wrong in get all products controller',
      error.message
    );
    return res.status(500).json({
      error: 'Something went wrong in get all products controller',
    });
  }
};

//get a single product
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({
        error: 'No product found',
      });
    }
    if (product) {
      res.status(200).json(product);
    }
  } catch (error) {
    console.log(
      'Something went wrong in get product by id controller',
      error.message
    );
    return res.status(500).json({
      error: 'Something went wrong in get product by id controller',
    });
  }
};

//update a single product
export const updateProduct = async (req, res) => {
  try {
    //check role so that only owner can update a product
    const checkRole = req.user.userRole === 'owner';

    //the id of the product to edit is gotten from the request params
    const { id } = req.params;

    //fiding the product to edit and storing it in a variable product
    const product = await Product.findById(id);

    //checking if the product exists
    if (!product) {
      return res.status(404).json({
        error: 'The product does not exist',
      });
    }

    //checking if the user is an owner and updating the product
    if (checkRole) {
      //updating the product * new: true * is used to return the updated product
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(updatedProduct);
    }

    //checking if the user is not an owner and sending an error response
    if (!checkRole) {
      return res.status(401).json({
        error: 'Only Owner can update products',
      });
    }
  } catch (error) {
    console.log(
      'Something went wrong in update product controller',
      error.message
    );
    return res.status(500).json({
      error: 'Something went wrong in update product controller',
    });
  }
};
