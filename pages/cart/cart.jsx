import { useState, useEffect } from "react";
import CartModal from "../../components/CartModal/CartModal";
import Image from "next/image";
import { useUserContext } from "../../context/UserContext/userContext";

import { BsFillBagCheckFill } from "react-icons/bs";
import { ImPriceTag, ImPlus, ImMinus } from "react-icons/im";

import styles from "./styles.module.scss";
import Head from "next/head";

const Cart = () => {
  const [cart, setCart] = useState({ cartItems: [], total: [] });
  const [refresh, setRefresh] = useState(false);
  const [checkout, setCheckout] = useState(false);

  const { userStore, setRefreshCartBadge } = useUserContext();

  const storeCartOnLocal = (groupedItems, cartTotal) => {
    localStorage.removeItem("groupedCart");
    const cartItems = JSON.parse(localStorage.getItem("groupedCart")) || [];

    cartItems.push({ cartItems: groupedItems, cartTotal: cartTotal });

    localStorage.setItem("groupedCart", JSON.stringify(cartItems));
  };

  const handleClickonMinus = (title) => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const itemIndex = storedCartItems.findIndex((item) => title == item.title);

    storedCartItems.splice(itemIndex, 1);

    localStorage.setItem("cartItems", JSON.stringify(storedCartItems));

    setRefresh((prev) => !prev);
    setRefreshCartBadge();
  };

  const handleClickonPlus = (title) => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const newItem = storedCartItems.filter((item) => title === item.title);

    storedCartItems.push(newItem[0]);

    localStorage.setItem("cartItems", JSON.stringify(storedCartItems));

    setRefresh((prev) => !prev);
    setRefreshCartBadge();
  };

  const handleCheckout = () => {
    setCheckout((prev) => !prev);
  };

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const filteredItems = storedCartItems.reduce(
      (a, { title, price, imgUrl }) => {
        const obj = a.get(title) || {
          title,
          price,
          imgUrl,
          totalPrice: [],
          packs: [],
        };
        obj.packs.push({ title, price });
        const priceNumValue = obj.packs.map((pack) =>
          parseInt(pack.price.split(" ")[1])
        );

        const totalsSingleItems = priceNumValue.reduce(
          (prev, post) => prev + post
        );

        obj.totalPrice.push(totalsSingleItems);

        return a.set(title, obj);
      },
      new Map()
    );

    const groupedItems = [...filteredItems.values()];

    const totalsSingleItems = groupedItems.map((item) =>
      item.totalPrice.slice(-1).reduce((prev, post) => prev + post)
    );

    const cartTotal =
      totalsSingleItems.length >= 1 &&
      totalsSingleItems.reduce((prev, post) => prev + post);

    storeCartOnLocal(groupedItems, cartTotal);

    const storedCart = JSON.parse(localStorage.getItem("groupedCart"));

    setCart({
      cartItems: storedCart[0].cartItems,
      cartTotal: storedCart[0].cartTotal,
    });
  }, [refresh]);

  return (
    <>
     <Head>
        <title>Cart</title>
        <meta property="og:title" content="Cart" key="title" />
      </Head>
      <section className={styles.CartPage}>
        <div className={styles.Container}>
          <div className={styles.Container__Cart}>
            <div className={styles.Wrapper_Head}>
              <h2 className={styles.Wrapper_Head__Title}>Cart</h2>
              <hr className={styles.Wrapper_Head__Breaker} />
            </div>
            {cart.cartItems.length === 0 && <p>Il carrello è vuoto</p>}
            {cart &&
              cart.cartItems.sort().map((item, index) => (
                <div className={styles.Container__Cart__Item} key={index}>
                  <div className={styles.Bagde}>
                    <div className={styles.ImgContainer}>
                      <Image
                        src={
                          item.imgUrl.split("?")[0] +
                          "?q=100&fm=jpg&fit=crop&w=2048&h=1152"
                        }
                        quality={100}
                        width="2048"
                        layout="fill"
                        alt="Item"
                        objectFit="cover"
                        sizes="20w"
                        className={styles.ImgContainer__image}
                      />
                    </div>
                    <div className={styles.Container_Info}>
                      <div className={styles.Wrapper_title}>
                        <BsFillBagCheckFill
                          className={styles.Wrapper_title__Bookmark}
                        />
                        <p className={styles.Wrapper_title__titleP}>
                          {item.title.split(" ").slice(0, 5).join(" ") + "..."}
                        </p>
                      </div>
                      <div className={styles.Wrapper_Price}>
                        <ImPriceTag
                          className={styles.Wrapper_Price__PriceTag}
                        />
                        <p className={styles.Wrapper_Price__text}>
                          {item.price}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.Container_count}>
                    <div className={styles.Wrapper_Counter}>
                      <button
                        className={styles.Cart_Button__Minus}
                        onClick={() => handleClickonMinus(item.title)}
                      >
                        <ImMinus />
                      </button>
                      <input
                        type="text"
                        readOnly
                        value={item.packs.length}
                        className={styles.Wrapper_Counter__Input}
                      />
                      <button
                        className={styles.Cart_Button__Plus}
                        onClick={() => handleClickonPlus(item.title)}
                      >
                        <ImPlus />
                      </button>
                    </div>
                    <p className={styles.Container_count__p}>
                      $ {item.totalPrice.slice(-1)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <hr className={styles.Wrapper_Head__Breaker} />
          <div className={styles.Wrapper_Total}>
            <div className={styles.Wrapper_Total__Container}>
              <h3 className={styles.Wrapper_Total__Container__title}>Total</h3>
              <p className={styles.Wrapper_Total__Container__text}>
                $ {cart.cartTotal}
              </p>
            </div>
            <button
              className={styles.Cart_Button__Checkout}
              onClick={handleCheckout}
            >
              To checkout
            </button>
          </div>
        </div>
      </section>
      {checkout && <CartModal setCheckout={setCheckout} />}
    </>
  );
};

export default Cart;
