const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const maybeFail = (failureRate = 0.08) => {
  if (Math.random() < failureRate) {
    const error = new Error('Failed to load data');
    error.code = 'MOCK_API_ERROR';
    throw error;
  }
};

const uid = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

let db = {
  products: [
    {
      id: 'p_suit_navy_001',
      name: 'Navy Wool Suit',
      price: 249,
      size: 'M',
      color: 'Navy',
      stock: 12,
      category: 'Suits',
      image: '',
    },
    {
      id: 'p_suit_charcoal_002',
      name: 'Charcoal Slim Suit',
      price: 269,
      size: 'L',
      color: 'Charcoal',
      stock: 5,
      category: 'Suits',
      image: '',
    },
    {
      id: 'p_blazer_tan_003',
      name: 'Tan Linen Blazer',
      price: 189,
      size: 'M',
      color: 'Tan',
      stock: 2,
      category: 'Blazers',
      image: '',
    },
    {
      id: 'p_shirt_white_004',
      name: 'White Dress Shirt',
      price: 49,
      size: 'M',
      color: 'White',
      stock: 22,
      category: 'Shirts',
      image: '',
    },
  ],
  customers: [
    { id: 'c_001', name: 'Adrian Miles', email: 'adrian@example.com', tier: 'Gold' },
    { id: 'c_002', name: 'Nia Carter', email: 'nia@example.com', tier: 'Silver' },
    { id: 'c_003', name: 'Victor Lane', email: 'victor@example.com', tier: 'Bronze' },
  ],
  orders: [
    {
      id: 'o_1001',
      customerId: 'c_002',
      customerName: 'Nia Carter',
      status: 'Pending',
      createdAt: '2026-03-26',
      total: 318,
      items: [
        { productId: 'p_suit_charcoal_002', name: 'Charcoal Slim Suit', qty: 1, price: 269 },
        { productId: 'p_shirt_white_004', name: 'White Dress Shirt', qty: 1, price: 49 },
      ],
    },
    {
      id: 'o_1002',
      customerId: 'c_001',
      customerName: 'Adrian Miles',
      status: 'Shipped',
      createdAt: '2026-03-25',
      total: 249,
      items: [{ productId: 'p_suit_navy_001', name: 'Navy Wool Suit', qty: 1, price: 249 }],
    },
    {
      id: 'o_1003',
      customerId: 'c_003',
      customerName: 'Victor Lane',
      status: 'Delivered',
      createdAt: '2026-03-22',
      total: 189,
      items: [{ productId: 'p_blazer_tan_003', name: 'Tan Linen Blazer', qty: 1, price: 189 }],
    },
  ],
  revenue: [
    { label: 'Mon', value: 420 },
    { label: 'Tue', value: 620 },
    { label: 'Wed', value: 320 },
    { label: 'Thu', value: 780 },
    { label: 'Fri', value: 510 },
    { label: 'Sat', value: 900 },
    { label: 'Sun', value: 610 },
  ],
  activity: [
    { id: 'a_1', type: 'order', message: 'New order o_1001 created', at: '2026-03-26 10:41' },
    { id: 'a_2', type: 'inventory', message: 'Tan Linen Blazer is low stock (2)', at: '2026-03-26 09:12' },
    { id: 'a_3', type: 'order', message: 'Order o_1002 marked as Shipped', at: '2026-03-25 14:20' },
  ],
};

const computeMetrics = () => {
  const orders = db.orders;
  const customers = db.customers;
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const revenueToday = orders
    .filter((order) => order.createdAt === '2026-03-26')
    .reduce((sum, order) => sum + order.total, 0);
  const lowStock = db.products.filter((p) => p.stock <= 3).length;

  return {
    totalSales,
    orders: orders.length,
    customers: customers.length,
    revenueToday,
    lowStock,
  };
};

export async function getDashboard() {
  await delay(650);
  maybeFail();
  return {
    metrics: computeMetrics(),
    revenue: [...db.revenue],
    activity: [...db.activity].slice(0, 6),
  };
}

export async function getProducts() {
  await delay(650);
  maybeFail();
  return [...db.products];
}

export async function createProduct(productInput) {
  await delay(650);
  maybeFail(0.05);
  const product = {
    id: uid(),
    name: productInput.name?.trim() || 'Untitled product',
    price: Number(productInput.price) || 0,
    size: productInput.size || '',
    color: productInput.color || '',
    stock: Number(productInput.stock) || 0,
    category: productInput.category || '',
    image: productInput.image || '',
  };
  db.products = [product, ...db.products];
  db.activity = [
    { id: uid(), type: 'product', message: `Product created: ${product.name}`, at: '2026-03-26 12:05' },
    ...db.activity,
  ];
  return product;
}

export async function updateProduct(productId, updates) {
  await delay(650);
  maybeFail(0.05);
  let updated = null;
  db.products = db.products.map((p) => {
    if (p.id !== productId) return p;
    updated = {
      ...p,
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) || 0 : p.price,
      stock: updates.stock !== undefined ? Number(updates.stock) || 0 : p.stock,
    };
    return updated;
  });
  if (!updated) throw new Error('Product not found');
  db.activity = [
    { id: uid(), type: 'product', message: `Product updated: ${updated.name}`, at: '2026-03-26 12:10' },
    ...db.activity,
  ];
  return updated;
}

export async function deleteProduct(productId) {
  await delay(650);
  maybeFail(0.05);
  const product = db.products.find((p) => p.id === productId);
  db.products = db.products.filter((p) => p.id !== productId);
  if (product) {
    db.activity = [
      { id: uid(), type: 'product', message: `Product deleted: ${product.name}`, at: '2026-03-26 12:15' },
      ...db.activity,
    ];
  }
  return { ok: true };
}

export async function getOrders() {
  await delay(650);
  maybeFail();
  return [...db.orders];
}

export async function updateOrderStatus(orderId, status) {
  await delay(650);
  maybeFail(0.05);
  let updated = null;
  db.orders = db.orders.map((o) => {
    if (o.id !== orderId) return o;
    updated = { ...o, status };
    return updated;
  });
  if (!updated) throw new Error('Order not found');
  db.activity = [
    { id: uid(), type: 'order', message: `Order ${orderId} marked as ${status}`, at: '2026-03-26 12:22' },
    ...db.activity,
  ];
  return updated;
}

export async function getCustomers() {
  await delay(650);
  maybeFail();
  return [...db.customers];
}

export async function getCustomerOrders(customerId) {
  await delay(450);
  maybeFail(0.06);
  return db.orders.filter((o) => o.customerId === customerId);
}

export async function getInventory() {
  await delay(550);
  maybeFail();
  return db.products.map((p) => ({
    id: p.id,
    name: p.name,
    stock: p.stock,
    category: p.category,
    lowStock: p.stock <= 3,
  }));
}

