import useStore from "../store/customStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function CartItem({ item }) {
  const { id, title, thumbnail, price, discountPercentage, quantity } = item;
  const { updateCart } = useStore();
  const discountedPrice = (price - (price * discountPercentage) / 100).toFixed(2);
  const itemTotal = (discountedPrice * quantity).toFixed(2);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="flex gap-3 p-3 border-b border-gray-100 last:border-b-0 bg-white">
      <span
        {...listeners}
        className="flex items-center text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing select-none"
      >
        ⠿
      </span>
      <img src={thumbnail} alt={title} className="w-16 h-16 object-cover rounded" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-800 truncate">{title}</h4>
        <p className="text-xs text-gray-500">${discountedPrice} each</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => updateCart("DEC", item)}
            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-sm hover:bg-gray-300 cursor-pointer"
          >
            −
          </button>
          <span className="text-sm font-medium w-6 text-center">{quantity}</span>
          <button
            onClick={() => updateCart("INC", item)}
            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-sm hover:bg-gray-300 cursor-pointer"
          >
            +
          </button>
          <button
            onClick={() => updateCart("REMOVE", item)}
            className="ml-auto text-xs text-red-500 hover:text-red-700 cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">${itemTotal}</span>
    </div>
  );
}
