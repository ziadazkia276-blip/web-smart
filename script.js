
const products = [
  // Elektronik
  { id: 1, name: "Laptop ASUS VivoBook", price: 6500000, icon: "💻" },
  { id: 2, name: "Smartphone Samsung", price: 3200000, icon: "📱" },
  { id: 3, name: "Mouse Wireless", price: 150000, icon: "🖱️" },
  { id: 4, name: "Keyboard Gaming", price: 275000, icon: "⌨️" },
  { id: 5, name: "Headphone Bluetooth", price: 350000, icon: "🎧" },
  { id: 6, name: "Monitor LED 24 Inch", price: 1750000, icon: "🖥️" },
  { id: 7, name: "Power Bank 20000mAh", price: 250000, icon: "🔋" },
  { id: 8, name: "Smartwatch", price: 520000, icon: "⌚" },
  { id: 9, name: "Speaker Bluetooth", price: 225000, icon: "🔊" },
  { id: 10, name: "Kamera Digital", price: 2800000, icon: "📷" },

  // Fashion
  { id: 11, name: "Sepatu Sneakers", price: 450000, icon: "👟" },
  { id: 12, name: "Tas Ransel", price: 320000, icon: "🎒" },
  { id: 13, name: "Kaos Fashion", price: 120000, icon: "👕" },
  { id: 14, name: "Jaket Hoodie", price: 250000, icon: "🧥" },
  { id: 15, name: "Jam Tangan Pria", price: 180000, icon: "⌚" },
  { id: 16, name: "Topi Casual", price: 75000, icon: "🧢" },

  // Peralatan rumah
  { id: 17, name: "Lampu Meja", price: 185000, icon: "💡" },
  { id: 18, name: "Kipas Angin", price: 350000, icon: "🌀" },
  { id: 19, name: "Rice Cooker", price: 425000, icon: "🍚" },
  { id: 20, name: "Blender Elektrik", price: 300000, icon: "🥤" },

  // Olahraga dan hobi
  { id: 21, name: "Bola Basket", price: 210000, icon: "🏀" },
  { id: 22, name: "Raket Badminton", price: 175000, icon: "🏸" },
  { id: 23, name: "Game Controller", price: 280000, icon: "🎮" },
  { id: 24, name: "Buku Produktivitas", price: 95000, icon: "📚" },
];


let cart = JSON.parse(localStorage.getItem("smartshop-cart") || "[]");

const rupiah = angka =>
  "Rp " + angka.toLocaleString("id-ID");

function saveCart() {
  localStorage.setItem("smartshop-cart", JSON.stringify(cart));
  document.getElementById("count").textContent =
    cart.reduce((total, item) => total + item.qty, 0);
}

function addCart(id) {
  const item = cart.find(item => item.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }

  saveCart();
  alert("Produk berhasil ditambahkan ke keranjang!");
}

function showPage(page) {
  const app = document.getElementById("app");

  if (page === "home" || page === "categories" ||
      page === "promos") {
    app.innerHTML = `
      <section class="hero">
        <h1>Belanja Online Lebih Mudah!</h1>
        <p>Produk berkualitas, harga terbaik, dan belanja nyaman.</p>
        <button onclick="showPage('categories')">
          Belanja Sekarang
        </button>
      </section>

      <h2>${page === "promos" ? "Promo Produk" : "Produk Terlaris"}</h2>
      <div class="products" id="productList"></div>
    `;

    renderProducts();
  }

  if (page === "cart") {
    let total = 0;

    const rows = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      const subtotal = product.price * item.qty;
      total += subtotal;

      return `
        <p>
          ${product.icon} ${product.name}
          × ${item.qty}
          — ${rupiah(subtotal)}
          <button onclick="removeCart(${product.id})">Hapus</button>
        </p>
      `;
    }).join("");

    app.innerHTML = `
      <h1>Keranjang Belanja</h1>
      ${rows || "<p>Keranjang masih kosong.</p>"}
      <h2>Total: ${rupiah(total)}</h2>
      <button onclick="showPage('checkout')">Checkout</button>
    `;
  }

  if (page === "checkout") {
    app.innerHTML = `
      <h1>Checkout</h1>
      <form onsubmit="placeOrder(event)">
        <p>Nama penerima</p>
        <input name="nama" required placeholder="Nama lengkap">
        <p>Alamat pengiriman</p>
        <textarea name="alamat" required placeholder="Alamat lengkap"></textarea>
        <p>Metode pembayaran</p>
        <select name="bayar">
          <option>Transfer Bank</option>
          <option>E-Wallet</option>
          <option>COD</option>
        </select>
        <br><br>
        <button type="submit">Buat Pesanan</button>
      </form>
    `;
  }

  if (page === "orders") {
    app.innerHTML = `
      <h1>Pesanan Saya</h1>
      <div id="orderList"></div>
    `;
    renderOrders();
  }

  if (page === "login") {
    app.innerHTML = `
      <h1>Login SmartShop</h1>
      <form onsubmit="loginDemo(event)">
        <p>Nama</p>
        <input name="nama" required>
        <p>Email</p>
        <input type="email" required>
        <p>Password</p>
        <input type="password" required minlength="4">
        <br><br>
        <button>Masuk</button>
      </form>
      <p>Login ini hanya simulasi frontend.</p>
    `;
  }

  if (page === "admin") {
    app.innerHTML = `
      <h1>Dashboard Admin</h1>
      <div class="products">
        <div class="product">
          <h3>Total Produk</h3><h2>120</h2>
        </div>
        <div class="product">
          <h3>Total Pesanan</h3>
          <h2>${getOrders().length}</h2>
        </div>
        <div class="product">
          <h3>Total Pelanggan</h3><h2>280</h2>
        </div>
      </div>
      <h2>Penjualan SmartShop</h2>
      <p>Dashboard ini menggunakan data demo.</p>
    `;
  }
}

function renderProducts() {
  const list = document.getElementById("productList");
  if (!list) return;

  const query = document.getElementById("search").value.toLowerCase();

  list.innerHTML = products
    .filter(p => p.name.toLowerCase().includes(query))
    .map(p => `
      <article class="product">
        <div class="emoji">${p.icon}</div>
        <h3>${p.name}</h3>
        <p class="price">${rupiah(p.price)}</p>
        <button onclick="addCart(${p.id})">
          + Keranjang
        </button>
      </article>
    `).join("") || "<p>Produk tidak ditemukan.</p>";
}

function removeCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  showPage("cart");
}

function getOrders() {
  return JSON.parse(localStorage.getItem("smartshop-orders") || "[]");
}

function placeOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Keranjang masih kosong.");
    return;
  }

  const form = new FormData(event.target);
  const order = {
    id: "SS" + Date.now(),
    nama: form.get("nama"),
    alamat: form.get("alamat"),
    pembayaran: form.get("bayar"),
    items: cart,
    tanggal: new Date().toLocaleDateString("id-ID")
  };

  const orders = getOrders();
  orders.unshift(order);

  localStorage.setItem("smartshop-orders", JSON.stringify(orders));
  cart = [];
  saveCart();

  alert("Pesanan berhasil dibuat!");
  showPage("orders");
}

function renderOrders() {
  const list = document.getElementById("orderList");
  const orders = getOrders();

  list.innerHTML = orders.map(order => `
    <div class="product" style="margin-bottom:12px;text-align:left">
      <h3>Pesanan ${order.id}</h3>
      <p>Nama: ${order.nama}</p>
      <p>Tanggal: ${order.tanggal}</p>
      <p>Status: Pesanan dibuat</p>
    </div>
  `).join("") || "<p>Belum ada pesanan.</p>";
}

function loginDemo(event) {
  event.preventDefault();
  alert("Login demo berhasil. Autentikasi server belum tersedia.");
  showPage("home");
}

document.getElementById("search").addEventListener("input", () => {
  if (["home", "categories", "promos"].includes(currentPage)) {
    renderProducts();
  }
});

let currentPage = "home";
saveCart();
showPage("home");