import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";
import { sendCartData, fetchCartData} from "./store/cart-actions";

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const noti = useSelector((state) => state.ui.notification);

  useEffect(()=>{
    dispatch(fetchCartData());
  },[dispatch])

  useEffect(() => {
    
    if(isInitial){
      isInitial = false;
      return;
    }
    if(cart.change){
    dispatch(sendCartData(cart))
    }

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
