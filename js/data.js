const restaurants = [

  // ─── BEIRUT ───────────────────────────────────────────────

  {
    id: 1,
    name: "Roadster Diner",
    type: "restaurant",
    city: "Beirut",
    location: "Hamra, Beirut",
    image: "https://live.staticflickr.com/3388/3645956551_61a033e50b_b.jpg",
    rating: 4.5,
    bundle: {
      id: 101,
      title: "Roadster Surprise Bag",
      price: 5,
      originalPrice: 18,
      quantity: 3,
      pickupTime: "9:00 PM - 10:00 PM",
      items: ["Chicken Strips", "Mozzarella Sticks", "Burger", "Fries"],
      description: "A mix of our most loved items at the end of the day!"
    }
  },
  {
    id: 2,
    name: "Barbar",
    type: "restaurant",
    city: "Beirut",
    location: "Hamra, Beirut",
    image: "https://www.sobeirut.com/contentFiles/image/venues/71/galeria/dscn7297.jpg",
    rating: 4.8,
    bundle: {
      id: 102,
      title: "Barbar Late Night Bag",
      price: 4,
      originalPrice: 15,
      quantity: 5,
      pickupTime: "11:00 PM - 12:00 AM",
      items: ["Shawarma", "Falafel Wrap", "Kafta Sandwich", "Juice"],
      description: "Classic Lebanese street food, don't miss it!"
    }
  },
  {
    id: 3,
    name: "Zaatar w Zeit",
    type: "restaurant",
    city: "Beirut",
    location: "Achrafieh, Beirut",
    image: "https://api.beiruting.com/content/uploads/venues/121119043645550.jpg",
    rating: 4.3,
    bundle: {
      id: 103,
      title: "ZwZ Manoushe Bundle",
      price: 3,
      originalPrice: 12,
      quantity: 7,
      pickupTime: "8:00 PM - 9:00 PM",
      items: ["Zaatar Manoushe", "Cheese Manoushe", "Spinach Fatayer", "Ayran"],
      description: "Fresh manoushe baked today, pick them up tonight!"
    }
  },
  {
    id: 4,
    name: "Café Younes",
    type: "cafe",
    city: "Beirut",
    location: "Hamra, Beirut",
    image: "https://cafeyounes.com/cdn/shop/files/CY-Badaro-1.jpg?v=1652082942&width=1067",
    rating: 4.7,
    bundle: {
      id: 104,
      title: "Younes Coffee & Pastry Bag",
      price: 4,
      originalPrice: 14,
      quantity: 4,
      pickupTime: "6:00 PM - 7:00 PM",
      items: ["Espresso", "Croissant", "Chocolate Muffin", "Orange Juice"],
      description: "End your day with Beirut's finest coffee and fresh pastries."
    }
  },
  {
    id: 5,
    name: "Couqley",
    type: "restaurant",
    city: "Beirut",
    location: "Gemmayzeh, Beirut",
    image: "https://via.placeholder.com/400x300?text=Couqley",
    rating: 4.6,
    bundle: {
      id: 105,
      title: "Couqley French Bag",
      price: 7,
      originalPrice: 25,
      quantity: 2,
      pickupTime: "10:00 PM - 11:00 PM",
      items: ["Croque Monsieur", "French Onion Soup", "Quiche", "Dessert"],
      description: "French bistro classics, surplus from today's service."
    }
  },
  {
    id: 6,
    name: "Urbanista",
    type: "cafe",
    city: "Beirut",
    location: "Verdun, Beirut",
    image: "https://via.placeholder.com/400x300?text=Urbanista",
    rating: 4.4,
    bundle: {
      id: 106,
      title: "Urbanista Café Bag",
      price: 5,
      originalPrice: 16,
      quantity: 6,
      pickupTime: "5:00 PM - 6:00 PM",
      items: ["Latte", "Avocado Toast", "Banana Bread", "Smoothie"],
      description: "Trendy café bites and drinks, fresh from this morning."
    }
  },
  {
    id: 7,
    name: "Al Falamanki",
    type: "cafe",
    city: "Beirut",
    location: "Sodeco, Beirut",
    image: "https://via.placeholder.com/400x300?text=Al+Falamanki",
    rating: 4.5,
    bundle: {
      id: 107,
      title: "Falamanki Heritage Bag",
      price: 6,
      originalPrice: 20,
      quantity: 3,
      pickupTime: "9:00 PM - 10:00 PM",
      items: ["Hummus", "Fattoush", "Cheese Sambousek", "Mint Lemonade"],
      description: "Traditional Lebanese mezze, surplus from today."
    }
  },
  {
    id: 8,
    name: "Wooden Bakery",
    type: "cafe",
    city: "Beirut",
    location: "Multiple Locations, Beirut",
    image: "https://via.placeholder.com/400x300?text=Wooden+Bakery",
    rating: 4.2,
    bundle: {
      id: 108,
      title: "Wooden Bakery End-of-Day Bag",
      price: 3,
      originalPrice: 11,
      quantity: 10,
      pickupTime: "7:00 PM - 8:00 PM",
      items: ["Ka3k", "Croissant", "Cheese Pie", "Zaatar Bread"],
      description: "Fresh bread and pastries baked today, must go tonight!"
    }
  },

  // ─── JBEIL (BYBLOS) ───────────────────────────────────────

  {
    id: 9,
    name: "Byblos Sur Mer",
    type: "restaurant",
    city: "Jbeil",
    location: "Old Port, Jbeil",
    image: "https://via.placeholder.com/400x300?text=Byblos+Sur+Mer",
    rating: 4.7,
    bundle: {
      id: 109,
      title: "Sur Mer Seafood Bag",
      price: 8,
      originalPrice: 30,
      quantity: 2,
      pickupTime: "10:00 PM - 11:00 PM",
      items: ["Grilled Fish", "Calamari", "Shrimp Pasta", "Garlic Bread"],
      description: "Fresh seafood surplus from our dinner service, right by the port!"
    }
  },
  {
    id: 10,
    name: "Byblos Fishing Club",
    type: "restaurant",
    city: "Jbeil",
    location: "Old Port, Jbeil",
    image: "https://via.placeholder.com/400x300?text=Fishing+Club",
    rating: 4.6,
    bundle: {
      id: 110,
      title: "Fishing Club Mixed Bag",
      price: 7,
      originalPrice: 24,
      quantity: 3,
      pickupTime: "9:30 PM - 10:30 PM",
      items: ["Fish Tacos", "Seafood Soup", "Shrimp Skewers", "Rice"],
      description: "The freshest catch of the day, now at a fraction of the price."
    }
  },
  {
    id: 11,
    name: "Kafa w Kaif",
    type: "cafe",
    city: "Jbeil",
    location: "Old Souk, Jbeil",
    image: "https://via.placeholder.com/400x300?text=Kafa+w+Kaif",
    rating: 4.5,
    bundle: {
      id: 111,
      title: "Kafa w Kaif Morning Bag",
      price: 4,
      originalPrice: 13,
      quantity: 5,
      pickupTime: "5:00 PM - 6:00 PM",
      items: ["Arabic Coffee", "Kaak Asrouniyye", "Cheese Croissant", "Juice"],
      description: "Cozy café in the heart of Jbeil's old souk. Fresh daily!"
    }
  },
  {
    id: 12,
    name: "Pepe Abed",
    type: "restaurant",
    city: "Jbeil",
    location: "Old Port, Jbeil",
    image: "https://via.placeholder.com/400x300?text=Pepe+Abed",
    rating: 4.8,
    bundle: {
      id: 112,
      title: "Pepe Abed Legend Bag",
      price: 9,
      originalPrice: 32,
      quantity: 2,
      pickupTime: "10:00 PM - 11:00 PM",
      items: ["Mezze Platter", "Grilled Halloumi", "Kibbeh", "Baklava"],
      description: "Iconic Jbeil restaurant since 1960. Surplus mezze tonight!"
    }
  },
  {
    id: 13,
    name: "Byblos Patisserie",
    type: "cafe",
    city: "Jbeil",
    location: "Main Street, Jbeil",
    image: "https://via.placeholder.com/400x300?text=Byblos+Patisserie",
    rating: 4.4,
    bundle: {
      id: 113,
      title: "Sweet Byblos Bag",
      price: 4,
      originalPrice: 14,
      quantity: 8,
      pickupTime: "7:00 PM - 8:00 PM",
      items: ["Mille Feuille", "Eclair", "Baklava", "Arabic Coffee"],
      description: "End your Jbeil evening with our finest pastries and sweets!"
    }
  },
  {
    id: 14,
    name: "Locanda",
    type: "restaurant",
    city: "Jbeil",
    location: "Old City, Jbeil",
    image: "https://via.placeholder.com/400x300?text=Locanda",
    rating: 4.5,
    bundle: {
      id: 114,
      title: "Locanda Italian Bag",
      price: 6,
      originalPrice: 22,
      quantity: 4,
      pickupTime: "9:00 PM - 10:00 PM",
      items: ["Pasta Arrabbiata", "Bruschetta", "Tiramisu", "Sparkling Water"],
      description: "Italian flavors in the heart of ancient Byblos. Buon appetito!"
    }
  }

];

// ─── FAKE LOGGED IN USER ──────────────────────────────────────
const currentUser = {
  id: 1,
  name: "Ahmad Khalil",
  email: "ahmad@gmail.com",
  type: "user",
  claimedOrders: [
    {
      orderId: 201,
      restaurantName: "Roadster Diner",
      bundleTitle: "Roadster Surprise Bag",
      price: 5,
      status: "Picked up",
      date: "2024-01-10"
    },
    {
      orderId: 202,
      restaurantName: "Pepe Abed",
      bundleTitle: "Pepe Abed Legend Bag",
      price: 9,
      status: "Ready for pickup",
      date: "2024-01-11"
    },
    {
      orderId: 203,
      restaurantName: "Byblos Patisserie",
      bundleTitle: "Sweet Byblos Bag",
      price: 4,
      status: "Ready for pickup",
      date: "2024-01-11"
    }
  ]
};

// ─── FAKE LOGGED IN RESTAURANT ────────────────────────────────
const currentRestaurant = {
  id: 9,
  name: "Byblos Sur Mer",
  email: "surmer@gmail.com",
  type: "restaurant",
  location: "Old Port, Jbeil"
};