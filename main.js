const baseUrl = "https://0pfl9nzhu3.execute-api.us-east-2.amazonaws.com";


// LOAD ITEMS
async function loadItems() {
  try {
    const res = await fetch(baseUrl);
    if (!res.ok) throw new Error("Failed to load items");
    const data = await res.json();

    const body = document.getElementById("itemsTable");
    body.innerHTML = "";

    data.forEach(item => {
      body.innerHTML += `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.price}</td>
          <td><button class="gray-btn" onclick="deleteItem('${item.id}')">Delete</button></td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Error loading items:", error);
    alert("Failed to load items. Check console for details.");
  }
}

// ADD ITEM
async function addItem() {
  const idValue = document.getElementById("idInput").value.trim();
  const name = document.getElementById("nameInput").value.trim();
  const price = parseFloat(document.getElementById("priceInput").value);

  if (!name || isNaN(price)) {
    alert("Please enter a valid name and price.");
    return;
  }

  const newItem = idValue ? { id: idValue, name, price } : { name, price };

  try {
    const res = await fetch(baseUrl, {
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Failed to add item:", err);
      alert("Failed to add item. Check console for details.");
      return;
    }

    // Clear inputs
    document.getElementById("idInput").value = "";
    document.getElementById("nameInput").value = "";
    document.getElementById("priceInput").value = "";
    let addedItem;
    try {
      addedItem = await res.json(); 
    } catch {
      addedItem = newItem;
    }

    const body = document.getElementById("itemsTable");
    body.innerHTML += `
      <tr>
        <td>${addedItem.id || "auto"}</td>
        <td>${addedItem.name}</td>
        <td>${addedItem.price}</td>
        <td><button class="gray-btn" onclick="deleteItem('${addedItem.id || ""}')">Delete</button></td>
      </tr>
    `;
  } catch (error) {
    console.error("Error adding item:", error);
    alert("Error adding item. Check console for details.");
  }
}

// DELETE ITEM
async function deleteItem(id) {
  if (!id) {
    alert("Cannot delete item: missing ID.");
    return;
  }

  try {
    const res = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete item");

    loadItems();
  } catch (error) {
    console.error("Error deleting item:", error);
    alert("Failed to delete item. Check console for details.");
  }
}

window.loadItems = loadItems;
window.addItem = addItem;
window.deleteItem = deleteItem;
