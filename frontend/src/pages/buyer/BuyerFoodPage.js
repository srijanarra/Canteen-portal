import React, { useEffect, useState } from "react";
import axios from "axios";
import Fuse from "fuse.js";

const BuyerFoodPage = () => {
  const buyerId = localStorage.getItem("buyerId");
  const [items, setItems] = useState([]);
  const [wallet, setWallet] = useState(0);

  // filters & search
  const [search, setSearch] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [selectedShops, setSelectedShops] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortOption, setSortOption] = useState("");

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // fetch all items (with vendor name populated)
    axios
      .get("http://localhost:3001/item")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching items", err));

    // fetch wallet (✅ using buyerId dynamically)
    axios
      .get(`http://localhost:3001/buyer/wallet/${buyerId}`)
      .then((res) => setWallet(res.data.amount))
      .catch((err) => console.error("Error fetching wallet", err));
  }, [buyerId]);

  // fuzzy search setup
  const fuse = new Fuse(items, {
    keys: ["name"],
    threshold: 0.3,
  });

  const handleSearch = (list) => {
    if (!search) return list;
    const results = fuse.search(search);
    return results.map((r) => r.item);
  };

  const applyFilters = (list) => {
    let filtered = [...list];

    if (vegOnly) filtered = filtered.filter((i) => i.veg);
    if (nonVegOnly) filtered = filtered.filter((i) => !i.veg);

    if (selectedShops.length)
      filtered = filtered.filter((i) =>
        selectedShops.includes(i.vendorId?.shopName)
      );

    if (selectedTags.length)
      filtered = filtered.filter((i) =>
        i.tags.some((tag) => selectedTags.includes(tag))
      );

    filtered = filtered.filter(
      (i) => i.price >= priceRange.min && i.price <= priceRange.max
    );

    if (sortOption === "priceAsc") filtered.sort((a, b) => a.price - b.price);
    if (sortOption === "priceDesc") filtered.sort((a, b) => b.price - a.price);
    if (sortOption === "ratingAsc") filtered.sort((a, b) => a.rating - b.rating);
    if (sortOption === "ratingDesc") filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
  };

  const handleBuy = (item, quantity, addons) => {
    axios
      .post("http://localhost:3001/order", {
        buyerId,
        itemId: item._id,
        quantity,
        addons,
      })
      .then(() => alert("Order placed!"))
      .catch(() => alert("Error placing order"));
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filteredItems = applyFilters(handleSearch(items));

  // Example logic: mark items unavailable if vendorId has isOpen = false
  const available = filteredItems.filter((i) => i.vendorId?.isOpen !== false);
  const unavailable = filteredItems.filter((i) => i.vendorId?.isOpen === false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Wallet Balance: ₹{wallet}</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      {/* Filters */}
      <div className="mb-4">
        <label>
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={() => setVegOnly(!vegOnly)}
          />{" "}
          Veg
        </label>
        <label className="ml-2">
          <input
            type="checkbox"
            checked={nonVegOnly}
            onChange={() => setNonVegOnly(!nonVegOnly)}
          />{" "}
          Non-Veg
        </label>

        {/* Price Range */}
        <div className="mt-2">
          Price Range:
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: +e.target.value })
            }
          />
          -
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: +e.target.value })
            }
          />
        </div>

        <select
          className="mt-2"
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="priceAsc">Price ↑</option>
          <option value="priceDesc">Price ↓</option>
          <option value="ratingAsc">Rating ↑</option>
          <option value="ratingDesc">Rating ↓</option>
        </select>
      </div>

      {/* Items List */}
      <h3 className="text-lg font-semibold mb-2">Food Items</h3>
      {[...available, ...unavailable].map((item) => (
        <div
          key={item._id}
          className={`border p-3 mb-2 rounded ${
            item.vendorId?.isOpen === false ? "opacity-50" : ""
          }`}
        >
          <div className="flex justify-between">
            <div>
              <h4 className="font-bold">{item.name}</h4>
              <p>
                ₹{item.price} | ⭐ {item.rating}
              </p>
              <p>
                {item.vendorId?.shopName} | {item.veg ? "Veg" : "Non-Veg"}
              </p>
              <p>Tags: {item.tags.join(", ")}</p>
            </div>
            <button onClick={() => toggleFavorite(item._id)}>
              {favorites.includes(item._id) ? "★" : "☆"}
            </button>
          </div>

          <div className="mt-2">
            Quantity:{" "}
            <input
              type="number"
              min="1"
              defaultValue={1}
              id={`qty-${item._id}`}
            />
            {/* Addons */}
            {item.addons &&
              item.addons.map((addon) => (
                <label key={addon.name} className="ml-2">
                  <input
                    type="checkbox"
                    value={addon.name}
                    id={`addon-${item._id}-${addon.name}`}
                  />{" "}
                  {addon.name} (+₹{addon.price})
                </label>
              ))}
          </div>

          <button
            disabled={item.vendorId?.isOpen === false}
            onClick={() => {
              const qty = parseInt(
                document.getElementById(`qty-${item._id}`).value
              );

              // ✅ Collect checked addons
              const addons = item.addons
                ? item.addons
                    .filter((addon) =>
                      document.getElementById(
                        `addon-${item._id}-${addon.name}`
                      ).checked
                    )
                    .map((addon) => addon.name)
                : [];

              handleBuy(item, qty, addons);
            }}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded disabled:bg-gray-400"
          >
            {item.vendorId?.isOpen === false ? "Unavailable" : "Buy"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default BuyerFoodPage;