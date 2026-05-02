import { create } from "zustand";
import { getCategories, getproducts } from "../api/getRes";
import {coupons} from "../cuppons.js";
const useStore = create((set, get) => ({
  products: {},
  cartData: {},
  offers: [],
  codeOffers: [],
  isCartOpen: false,
  loading: false,
  hasMore: true,
  filter: {
    limit: 10,
    skip: 0,
  },
  categories:[],
  toggleCart: (open) => set({ isCartOpen: open !== undefined ? open : !get().isCartOpen }),

  changeFilter: () => {
   set((state) => ({
    filter: {
      ...state.filter,
      skip: state.filter.skip + state.filter.limit
    }
   }))
  },

  setProducts: async () => {
    const { products, filter, loading, hasMore } = get();
    if (loading || !hasMore) return;

    set({ loading: true });
    const data = await getproducts(filter);
    if (!data) {
      set({ loading: false });
      return;
    }

    const finalData = filter.skip !== 0
      ? { ...data, products: [...(products?.products || []), ...data.products] }
      : data;

    set({
      products: finalData,
      loading: false,
      hasMore: filter.skip + filter.limit < data.total,
    });
  },

  setCategories: async () => {
   const data = await getCategories()
   set({categories: data})
  },

  reorderCart: (reorderedItems) => {
    set((state) => ({
      cartData: { ...state.cartData, items: reorderedItems },
    }));
  },

  reorderCartItemsPerCategory: (reorderedItems, category) => {
    set((state) => ({
      cartData: { ...state.cartData,
      itemsPerCategory: state.cartData.itemsPerCategory.map(itm => itm[category] ? {[category]: reorderedItems} : itm) },
    }));
  },

  updateCart: (action, product) => {
    const {applyOffer, cartData} = get()
    set((state) => {
      const getUpdatedItems = () => {
        let itms = [];
        const prevItms = state.cartData.items || [];
        const currentCount = prevItms.find(
              (itm) => itm.id === product.id,
            )?.quantity || 0;
        switch (action) {
          case "ADD":
            itms = currentCount > 0 ?prevItms.map((itm) =>
              product.id === itm.id
                ? {
                    ...itm,
                    quantity: itm.quantity + 1,
                  }
                : itm,
            ): [...prevItms, product]
            break;
          case "REMOVE":
            itms = prevItms.filter((itm) => itm.id !== product.id);
            break;
          case "INC":
            itms = prevItms.map((itm) =>
              product.id === itm.id
                ? {
                    ...itm,
                    quantity: itm.quantity + 1,
                  }
                : itm,
            );
            break;
          default:
            itms =
              currentCount > 1
                ? prevItms.map((itm) =>
                    product.id === itm.id
                      ? {
                          ...itm,
                          quantity: itm.quantity - 1,
                        }
                      : itm,
                  )
                : prevItms.filter((itm) => itm.id !== product.id);
            break;
        }
        return itms;
      };
      const updatedItems = getUpdatedItems().sort((a, b) => b.timeStamp - a.timeStamp);
      return {
        isCartOpen: action === "ADD" ? true : state.isCartOpen,
        cartData: {
          ...state.cartData,
          items: updatedItems,
          itmCount: updatedItems.length,
          totalCount: updatedItems.reduce(
            (acc, itm) => (acc += itm.quantity),
            0
        ),
        totalPrice: !state.cartData?.discount?.appliedDiscountValue ? updatedItems.reduce((sum, itm) => sum + (itm.price - (itm.price * itm.discountPercentage) / 100) * itm.quantity, 0).toFixed(2) : updatedItems.reduce((sum, itm) => sum + (itm.price - (itm.price * itm.discountPercentage) / 100) * itm.quantity, 0).toFixed(2) - state.cartData?.discount?.appliedDiscountValue
        },
      };
    });
    applyOffer()
  },

  setCartPerCategory: (cats) => {
   set(state => {
    const itemsPerCategory = cats.map(c => ({
      [c]: state.cartData.items.filter(itm => itm.category === c )
    }))
    return{
      cartData: {
        ...state.cartData,
        itemsPerCategory
      }
    }
   })
  },

  applyOffer: () => {
    const {cartData, offers} = get()
    if (cartData.discount?.autoApply === false) {
      return
    }
    const updatedItems = cartData.items
    const totalItemsCount = updatedItems.reduce((acc, itm) => (acc += itm.quantity),0)
    const totalCartprice = updatedItems.reduce((sum, itm) => sum + (itm.price - (itm.price * itm.discountPercentage) / 100) * itm.quantity, 0).toFixed(2)
    const thresholds = ["cart_threshold", "product_in_cart", "product_quantity"]
    let applicableOffers = thresholds.map(itm => {
      let offersPerThreshold = []
      switch (itm) {
        case "cart_threshold":
          offersPerThreshold = coupons.filter(c => c.minCartTotal <= totalCartprice)
          break;
        case "product_in_cart":
          offersPerThreshold = coupons.filter(c => updatedItems.some(it => c.productId === it.id))
          break;
        case "product_quantity":
          offersPerThreshold = coupons.filter(c => !c.productId ? totalItemsCount >= c.minQty : updatedItems.some(itm => itm.id === c.productId && c.minQty <= updatedItems.find(p => p.id === c.productId).quantity) )
          break;
        default:
          break;
      }
      return offersPerThreshold
    }).flat()
    console.log("applicable offers",applicableOffers);
    const autoApplicableOffers = applicableOffers.filter(c => c.autoApply)
    if (autoApplicableOffers.length > 0) {
      const calcDiscount = (c) => {
        const raw = c.discountType === "percentage" ? totalCartprice * c.discountValue / 100 : c.discountValue
        return c.discountType === "percentage" ? (c.maxDiscount && raw > c.maxDiscount ? c.maxDiscount : raw) : raw
      }

      const best = autoApplicableOffers.reduce((prev, curr) =>
        calcDiscount(curr) > calcDiscount(prev) ? curr : prev
      )
      
      const validDiscountPrice = calcDiscount(best)
      const discountedPrice = totalCartprice - validDiscountPrice
      set(state => ({
        cartData: {
          ...state.cartData,
          totalPrice: discountedPrice.toFixed(2),
          offerApplied: true,
          discount: {
            ...best,
            appliedDiscountValue: validDiscountPrice.toFixed(2)
          },
        }
      }))
    } else {
      set(state => ({
        cartData: {
          ...state.cartData,
          discount: null,
          offerApplied: false,
          totalPrice: totalCartprice
        }
      }))
    }

    set({
      offers: applicableOffers
    })
  },

  applyOfferThroughInputField: (code) => {
    const { cartData, codeOffers } = get()
    const updatedItems = cartData.items || []
    const totalItemsCount = updatedItems.reduce((acc, itm) => (acc += itm.quantity), 0)
    const totalCartprice = updatedItems.reduce((sum, itm) => sum + (itm.price - (itm.price * itm.discountPercentage) / 100) * itm.quantity, 0).toFixed(2)

    const coupon = coupons.find(c => c.code && c.code.toUpperCase() === code.trim().toUpperCase())

    if (!coupon) return { success: false, message: "Invalid coupon code." }
    if (!coupon.active) return { success: false, message: "This coupon is no longer active." }

    const isValid = (() => {
      switch (coupon.conditionType) {
        case "cart_threshold":
          return totalCartprice >= coupon.minCartTotal
        case "product_in_cart":
          return updatedItems.some(itm => itm.id === coupon.productId)
        case "product_quantity":
          return coupon.productId
            ? updatedItems.some(itm => itm.id === coupon.productId && itm.quantity >= coupon.minQty)
            : totalItemsCount >= coupon.minQty
        default:
          return false
      }
    })()

    if (!isValid) {
      const reasons = {
        cart_threshold: `Minimum cart total of ₹${coupon.minCartTotal} required.`,
        product_in_cart: "Required product is not in your cart.",
        product_quantity: `Minimum quantity of ${coupon.minQty} required.`,
      }
      return { success: false, message: reasons[coupon.conditionType] || "Coupon conditions not met." }
    }

    const raw = coupon.discountType === "percentage" ? totalCartprice * coupon.discountValue / 100 : coupon.discountValue
    const validDiscountPrice = coupon.discountType === "percentage"
      ? (coupon.maxDiscount && raw > coupon.maxDiscount ? coupon.maxDiscount : raw)
      : raw
    const discountedPrice = totalCartprice - validDiscountPrice

    set(state => ({
      cartData: {
        ...state.cartData,
        totalPrice: discountedPrice.toFixed(2),
        offerApplied: true,
        discount: {
          ...coupon,
          appliedDiscountValue: validDiscountPrice.toFixed(2)
        }
      }
    }))
    const isPresent = codeOffers.some(c => c.code === coupon.code)
    !isPresent && set(state => ({
      codeOffers: [{ ...coupon, appliedDiscountValue: validDiscountPrice.toFixed(2) }]
    }))

    return { success: true, message: `Coupon applied! You saved ₹${validDiscountPrice.toFixed(2)}.` }
  },

  removeCodeOffer: (couponId) => {
    const { cartData, codeOffers, applyOffer } = get()
    const remaining = codeOffers.filter(c => c.id !== couponId)
    const totalCartprice = (cartData.items || []).reduce((sum, itm) => sum + (itm.price - (itm.price * itm.discountPercentage) / 100) * itm.quantity, 0).toFixed(2)
    if (remaining.length === 0) {
      set(state => ({
        codeOffers: [],
        cartData: {
          ...state.cartData,
          discount: null,
          offerApplied: false,
          totalPrice: totalCartprice
        }
      }))
    } else {
      const last = remaining[remaining.length - 1]
      const discountedPrice = (totalCartprice - last.appliedDiscountValue).toFixed(2)
      set(state => ({
        codeOffers: remaining,
        cartData: {
          ...state.cartData,
          totalPrice: discountedPrice,
          discount: last
        }
      }))
    }
    applyOffer()
  }
}));

export default useStore;
