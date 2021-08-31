import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./ui-slice";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
  },
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      state.totalQuantity--;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
      }
    },
  },
});

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNoti({
        status: "pending",
        title: "Sending",
        msg: "Sending cart data...",
      })
    );

    const sendRequest = async () => {
      const res = await fetch(
        "https://react-http-7db00-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );
      if (!res.ok) {
        throw new Error("ups, something went wrong :(");
      }
    };

    try {
      await sendRequest();

      dispatch(
        uiActions.showNoti({
          status: "success",
          title: "Success!",
          msg: "alto capo se mando todo piola",
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNoti({
          status: "error",
          title: "Error!",
          msg: "todo mal :(",
        })
      );
    }
  };
};

export const cartActions = cartSlice.actions;

export default cartSlice;
