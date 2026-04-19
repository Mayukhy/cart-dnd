import { useEffect, useState } from "react";
import useStore from "../store/customStore";
import CartItem from "./CartItem";
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

export default function Cart() {
  const { cartData, categories, setCategories,setCartPerCategory, isCartOpen, toggleCart, reorderCart, reorderCartItemsPerCategory } = useStore();
  const items = cartData.items || [];
  const itemsPerCategory = cartData.itemsPerCategory || cartData.items || []
  const tabs = [
    {
      value: "All in One"
    },
    {
      value: "Categorized"
    }
  ]
  const [currentTab, setCurrentTab] = useState(0)

  useEffect(() => {
    setCategories();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      reorderCart(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleDragEndPerCategory = (event, category, currentCategoryItems) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = currentCategoryItems.findIndex((i) => i.id === active.id);
      const newIndex = currentCategoryItems.findIndex((i) => i.id === over.id);
      reorderCartItemsPerCategory(arrayMove(currentCategoryItems, oldIndex, newIndex), category);
    }
  };

  
  const cartCategories = cartData.items ? categories.filter(itm => cartData.items.some(i => i.category === itm)) : []
  useEffect(() => {
     setCartPerCategory(cartCategories)
  },[cartData.items])
  console.log(cartData);
  

  return (
    <>
      {/* Overlay for mobile */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => toggleCart(false)}
        />
      )}

      {/* Drawer on mobile, static sidebar on desktop */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 z-50 bg-white shadow-lg flex flex-col
          transition-transform duration-300 ease-in-out
          ${isCartOpen ? "translate-x-0" : "translate-x-full"}
          md:static md:translate-x-0 md:shadow-sm md:h-fit md:max-h-[90vh] md:rounded-lg md:border md:border-gray-200
        `}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold">Cart ({cartData.totalCount || 0})</h2>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {
              tabs.map((itm,idx) => (
                <button key={idx} onClick={() => {
                  setCurrentTab(idx)
                }} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${idx === currentTab ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{itm.value}</button>
              ))
            }
          </div>
          <button
            onClick={() => toggleCart(false)}
            className="md:hidden text-gray-500 hover:text-gray-800 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <p className="p-4 text-sm text-gray-400 text-center">Cart is empty</p>
          ) : (
            <>
              { currentTab === 1 ? 
                <div className="flex flex-col">
                  {
                    itemsPerCategory.map((itm,idx) => {
                      const currentCategoryItems = itm[cartCategories[idx]]
                      return (
                        <div className="flex flex-col gap-4 border-b border-gray-200 last:border-0" key={idx}>
                          <h3 className="text-md font-semibold text-gray-700 uppercase ml-2 mt-2">{cartCategories[idx]}</h3>
                          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => handleDragEndPerCategory(event, cartCategories[idx], currentCategoryItems)}>
                            <SortableContext items={currentCategoryItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                              {currentCategoryItems.map((item) => (
                                <CartItem key={item.id} item={item} />
                              ))}
                            </SortableContext>
                          </DndContext>
                        </div>
                      )
                    })
                  }
                </div>:
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </SortableContext>
                </DndContext>
              }
            </>
          )}
        </div>
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Items</span>
              <span>{cartData.itmCount}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-green-600">
                ${cartData.totalPrice}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
