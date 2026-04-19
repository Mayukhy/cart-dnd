import './App.css'
import ProductsList from './components/ProductsList'
import Cart from './components/Cart'
import useStore from './store/customStore'

function App() {
  const { cartData, toggleCart } = useStore()

  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-30">
        <h1 className="text-xl font-bold">Shop</h1>
        <button
          onClick={() => toggleCart()}
          className="relative md:hidden cursor-pointer p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {(cartData.totalCount || 0) > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartData.totalCount}
            </span>
          )}
        </button>
      </header>

      {/* Content */}
      <div className="flex md:flex-row flex-col flex-1 overflow-hidden p-6 gap-4">
        <ProductsList />
        <Cart />
      </div>
    </div>
  )
}

export default App
