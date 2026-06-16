const METAL_COLORS = {
  "Yellow Gold": "#E8B923",
  "White Gold": "#D9D9D9",
  "Rose Gold": "#E8A090",
};

const GEM_COLORS = {
  White: "#F0F0F0",
  Emerald: "#50C878",
  Ruby: "#E0115F",
};

export default function CartModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Added to Cart
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all text-gray-500 text-lg"
          >
            ✕
          </button>
        </div>

        <hr className="border-gray-100" />

        {/* Product Title */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
            Fine Jewellery
          </p>
          <h3 className="text-2xl font-semibold">{item.title}</h3>
        </div>

        {/* Configuration Details */}
        <div className="bg-[#F9F7F5] rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 text-sm">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
            Your Configuration
          </p>

          {/* Metal */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Metal</span>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-gray-200 inline-block"
                style={{ backgroundColor: METAL_COLORS[item.metal] }}
              />
              <span className="font-medium text-gray-900">{item.metal}</span>
            </div>
          </div>

          {/* Gem */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Gem</span>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-gray-200 inline-block"
                style={{ backgroundColor: GEM_COLORS[item.gem] }}
              />
              <span className="font-medium text-gray-900">{item.gem}</span>
            </div>
          </div>

          {/* Variant ID */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Variant ID</span>
            <span className="font-medium text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg">
              #{item.variantId}
            </span>
          </div>

          <hr className="border-gray-200" />

          {/* Price */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total</span>
            <span className="font-semibold text-gray-900 text-base">
              {item.formattedPrice}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-900 text-white rounded-full font-semibold text-sm tracking-wide hover:bg-gray-700 transition-all"
          >
            Continue Shopping
          </button>
          <button className="w-full py-4 border border-gray-200 text-gray-900 rounded-full font-semibold text-sm tracking-wide hover:border-gray-400 hover:bg-gray-50 transition-all">
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
}
