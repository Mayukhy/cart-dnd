import { create } from "zustand";
import { getCategories, getproducts } from "../api/getRes";

const useStore = create((set, get) => ({
  products: {},
  cartData: {},
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
        totalPrice: updatedItems.reduce((sum, itm) => sum + (itm.price - (itm.price * itm.discountPercentage) / 100) * itm.quantity, 0).toFixed(2)
        },
      };
    });
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
  }
}));

export default useStore;
