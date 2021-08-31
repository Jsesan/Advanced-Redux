import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { uiActions } from "./store/ui-slice";
import Notification from "./components/UI/Notification";

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const noti = useSelector((state) => state.ui.notification);

  useEffect(() => {
    
    const sendCartData = async () => {
      dispatch(
        uiActions.showNoti({
          status: "pending",
          title: "Sending",
          msg: "Sending cart data...",
        })
      );
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

      dispatch(
        uiActions.showNoti({
          status: "success",
          title: "Success!",
          msg: "alto capo se mando todo piola",
        })
      );
    };

    if(isInitial){
      isInitial = false;
      return;
    }

    sendCartData().catch((error) => {
      dispatch(
        uiActions.showNoti({
          status: "error",
          title: "Error!",
          msg: "todo mal :(",
        })
      );
    });
  }, [cart, dispatch]);

  return (
    <Fragment>
      {noti && (
        <Notification status={noti.status} title={noti.title} msg={noti.msg} />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
