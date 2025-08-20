import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VendorMenu() {
  const vendorId = localStorage.getItem('vendorId');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    veg: true,
    addons: [],
    tags: ''
  });
  const [addon, setAddon] = useState({ name: '', price: '' });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    veg: true,
    addons: [],
    tags: [],
  });


    const handleEdit = (item) => {
      setEditingId(item._id);
      setEditForm({
        name: item.name,
        price: item.price,
        veg: item.veg,
        addons: item.addons || [],
        tags: item.tags || [],
      });
    };


    const handleUpdate = async (id) => {
      if (!editForm.name.trim()) {
        alert("Item name is required");
        return;
      }
      if (editForm.price < 0) {
        alert("Price cannot be negative");
        return;
      }
      for (let addon of editForm.addons) {
        if (!addon.name.trim()) {
          alert("Addon name cannot be empty");
          return;
        }
        if (addon.price < 0) {
          alert("Addon price cannot be negative");
          return;
        }
      }

      try {
        const res = await axios.put(
          `http://localhost:3001/item/${id}`,
          editForm
        );
        setItems(items.map((item) => (item._id === id ? res.data : item)));
        setEditingId(null);
      } catch (err) {
        console.error(err);
      }
    };



  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/item/${vendorId}`);
        setItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (vendorId) fetchItems();
  }, [vendorId]);

  // Add new item
 const handleAdd = async () => {
   if (!newItem.name.trim()) {
     alert("Item name is required");
     return;
   }
   if (newItem.price < 0) {
     alert("Price cannot be negative");
     return;
   }
   for (let addon of newItem.addons) {
     if (!addon.name.trim()) {
       alert("Addon name cannot be empty");
       return;
     }
     if (addon.price < 0) {
       alert("Addon price cannot be negative");
       return;
     }
   }

   try {
     const res = await axios.post("http://localhost:3001/item", {
       ...newItem,
       rating: 0, // default rating
     });
     setItems([...items, res.data]);
     setNewItem({ name: "", price: "", veg: true, addons: [], tags: [] });
   } catch (err) {
     console.error(err);
   }
 };


  // Add addon temporarily before submitting
  const handleAddAddon = () => {
    if (addon.name && addon.price) {
      setNewItem({ ...newItem, addons: [...newItem.addons, addon] });
      setAddon({ name: '', price: '' });
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/item/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Food Menu</h2>

      {/* Add New Item */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <h3>Add Item</h3>
        <input
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <select
          value={newItem.veg}
          onChange={(e) =>
            setNewItem({ ...newItem, veg: e.target.value === "true" })
          }
        >
          <option value="true">Veg</option>
          <option value="false">Non-Veg</option>
        </select>

        {/* Addons */}
        <div>
          <input
            placeholder="Addon name"
            value={addon.name}
            onChange={(e) => setAddon({ ...addon, name: e.target.value })}
          />
          <input
            placeholder="Addon price"
            type="number"
            value={addon.price}
            onChange={(e) => setAddon({ ...addon, price: e.target.value })}
          />
          <button onClick={handleAddAddon}>Add Addon</button>
        </div>
        <ul>
          {newItem.addons.map((a, i) => (
            <li key={i}>
              {a.name} - ₹{a.price}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <input
          placeholder="Tags (comma separated)"
          value={newItem.tags}
          onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
        />

        <button onClick={handleAdd}>Add Item</button>
      </div>

      {items.map((item) => (
        <li key={item._id}>
          {item._id === editingId ? (
            // Edit mode
            <div>
              {/* Name */}
              <input value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Name"
              />

              {/* Price */}
              <input
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                placeholder="Price"
              />

              {/* Veg/Non-Veg */}
              <select
                value={editForm.veg}
                onChange={(e) =>
                  setEditForm({ ...editForm, veg: e.target.value === "true" })
                }
              >
                <option value="true">Veg</option>
                <option value="false">Non-Veg</option>
              </select>

              {/* Addons */}
              <div>
                <h4>Addons</h4>
                {editForm.addons.map((addon, idx) => (
                  <div key={idx}>
                    <input
                      value={addon.name}
                      placeholder="Addon Name"
                      onChange={(e) => {
                        const updated = [...editForm.addons];
                        updated[idx].name = e.target.value;
                        setEditForm({ ...editForm, addons: updated });
                      }}
                    />
                    <input
                      type="number"
                      value={addon.price}
                      placeholder="Price"
                      onChange={(e) => {
                        const updated = [...editForm.addons];
                        updated[idx].price = e.target.value;
                        setEditForm({ ...editForm, addons: updated });
                      }}
                    />
                    <button
                      onClick={() => {
                        const updated = editForm.addons.filter(
                          (_, i) => i !== idx
                        );
                        setEditForm({ ...editForm, addons: updated });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setEditForm({
                      ...editForm,
                      addons: [...editForm.addons, { name: "", price: "" }],
                    })
                  }
                >
                  + Add Addon
                </button>
              </div>

              {/* Tags */}
              <div>
                <h4>Tags</h4>
                {editForm.tags.map((tag, idx) => (
                  <div key={idx}>
                    <input
                      value={tag}
                      placeholder="Tag"
                      onChange={(e) => {
                        const updated = [...editForm.tags];
                        updated[idx] = e.target.value;
                        setEditForm({ ...editForm, tags: updated });
                      }}
                    />
                    <button
                      onClick={() => {
                        const updated = editForm.tags.filter(
                          (_, i) => i !== idx
                        );
                        setEditForm({ ...editForm, tags: updated });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setEditForm({
                      ...editForm,
                      tags: [...editForm.tags, ""],
                    })
                  }
                >
                  + Add Tag
                </button>
              </div>

              {/* Save/Cancel */}
              <button onClick={() => handleUpdate(item._id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            // Normal view
            <div>
              <strong>{item.name}</strong> - ₹{item.price} (
              {item.veg ? "Veg" : "Non-Veg"})
              <br />Rating: {item.rating}<br />
              Addons:{" "}
              {item.addons.map((a) => `${a.name} (₹${a.price})`).join(", ")}
              <br />Tags: {item.tags.join(", ")}<br />
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          )}
        </li>
      ))}
    </div>
  );
}

export default VendorMenu;
