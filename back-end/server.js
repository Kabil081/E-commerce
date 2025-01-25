const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const Cart = require('./CartSchema');
const User = require('./UserSchema');
const Product = require('./ProductSchema');
const app = express();

dotenv.config();
console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);

app.use(
    cors({
      origin: "http://localhost:5173", 
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
);

const mongodb_uri = process.env.MONGODB_URI;
mongoose.connect(mongodb_uri).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.use(bodyparser.json());
app.use(cookieParser());

const authenticate = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.status(400).json({ message: 'User Doesn’t Exist' });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Password!' });
    }
    
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT_SECRET is not defined' });
    }

    const token = jwt.sign(
        { userId: existingUser._id, email: existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '10h' }
    );
    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: oneMonthInMs,
    });
    res.cookie('userId', existingUser._id.toString(), {
        httpOnly: false,
        maxAge: oneMonthInMs,
    });
    return res.status(200).json({ message: 'Login Successful!', userId: existingUser._id });
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        const userId = user._id.toString(); 
        console.log('User created with ID:', userId);  
        return res.status(201).json({ message: 'Sign-Up Successful!', userId: userId });
    } catch (error) {
        console.error('Error during sign-up:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/add-product', async (req, res) => {
    const { name, price, description, category, imageUrl } = req.body;
    const prod = { name, price, description, category, imageUrl };
    try {
        const product = new Product(prod);
        await product.save();
        return res.status(201).json({ message: 'Product Added Successfully!' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Error', error: error.message });
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Error Fetching data' });
    }
});
app.post('/add-to-cart', async (req, res) => {
    const { name, price, userId, productId, quantity } = req.body;
    if (!name || !price || !userId || !productId || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive number' });
    }
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const productObjectId = new mongoose.Types.ObjectId(productId);
        let cart = await Cart.findOne({ userId: userObjectId });
        if (cart) {
            const index = cart.items.findIndex(
                (item) => item.productId.toString() === productObjectId.toString()
            );
            if (index > -1) {
                cart.items[index].quantity += quantity;
            } else {
                cart.items.push({ productId: productObjectId, name, price, quantity });
            }
        } else {
            cart = new Cart({
                userId: userObjectId,
                items: [{ productId: productObjectId, name, price, quantity }],
            });
        }
        cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await cart.save();
        res.status(200).json({ message: 'Successfully added to cart', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Failed to add to cart' });
    }
});
app.post('/remove-from-cart', async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
      console.error("Missing userId or productId");
      return res.status(400).json({ message: "Missing userId or productId" });
  }
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      console.error("Invalid userId or productId format");
      return res.status(400).json({ message: "Invalid userId or productId format" });
  }
  try {
      const user = await User.findById(new mongoose.Types.ObjectId(userId));
      if (!user) {
          console.error("User not found");
          return res.status(404).json({ message: "User not found" });
      }
      const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!cart) {
          console.error("Cart not found");
          return res.status(404).json({ message: "Cart not found" });
      }
      if (!Array.isArray(cart.items)) {
          console.error("Cart items array is undefined or not an array");
          return res.status(500).json({ message: "Cart items array is undefined or not an array" });
      }
      const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (productIndex > -1) {
          cart.items.splice(productIndex, 1);
          cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          await cart.save();
          return res.status(200).json({ message: "Product removed from cart", cart: cart.items });
      } else {
          console.error("Product not found in cart");
          return res.status(404).json({ message: "Product not found in cart" });
      }
  } catch (error) {
      console.error("Error removing product:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});
app.post("/update-cart", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId || quantity <= 0) {
    return res.status(400).json({ message: "Invalid input" });
  }
  try {
    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Product not in cart" });
    }
    item.quantity = quantity;
    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get('/cart', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ message: "Error in userId" });
  }
  try {
    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res.status(200).json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});
app.listen(5000,()=>{
    console.log("Server running on port 5000");
});