const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const User = require("../models/user.model");
// const config = require("config");
// const stripe = require("stripe")(config.get("StripeAPIKey"));

const placeOrder = async (req, res) => {
  try {
    const userId = req.params.id;
    const { source } = req.body;
    let cart = await Cart.findOne({ userId });
    let user = await User.findOne({ _id: userId });
    const email = user.email;
    if (cart) {
      // const charge = await stripe.charges.create({
      //     amount: cart.bill,
      //     currency: "NGN",
      //     source: source,
      //     receipt_email: email,
      // });
      if (!charge) throw Error("Payment failed");
      if (charge) {
        const order = await Order.create({
          userId,
          books: cart.books,
          bill: cart.bill,
        });
        const data = await Cart.findByIdAndDelete({ _id: cart.id });
        return res.status(201).send(order);
      }
    } else {
      res.status(500).send("You do not have books in cart");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

const getOrder = async (req, res) => {
  const userId = req.params.id;
  Order.find({ userId })
    .sort({ date: -1 })
    .then((orders) => res.json(orders));
};

module.exports = {
  placeOrder,
  getOrder,
};
