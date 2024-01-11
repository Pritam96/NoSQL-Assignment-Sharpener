const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    cart: {
      items: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product ID is missing"],
          },
          quantity: {
            type: Number,
            required: [true, "Quantity is required"],
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.addToCart = function (product) {
  let newQuantity = 1;
  const updateCartItems = [...this.cart.items];

  // this product already exists
  const cartProductIndex = this.cart.items.findIndex(
    (cp) => cp.product.toString() === product._id.toString()
  );

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updateCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updateCartItems.push({
      product: product._id,
      quantity: newQuantity,
    });
  }

  this.cart = {
    items: updateCartItems,
  };

  return this.save();
};

UserSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  this.cart = { items: updatedCartItems };
  return this.save();
};

UserSchema.methods.clearCart = function (product) {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", UserSchema);
