export const mockCategories = [
  {
    id: 'cat_grocery',
    name: 'Grocery Runs',
    description: 'Snacks, drinks, and daily essentials',
    icon: 'ShoppingBag',
    baseFee: 15.00,
    items: [
      { id: 'item_1', name: 'Doritos Sweet Chili 150g', price: 25.00 },
      { id: 'item_2', name: 'Coca-Cola 2L', price: 28.00 },
      { id: 'item_3', name: 'Bakers Blue Label Marie Biscuits', price: 18.00 },
      { id: 'item_4', name: '2-Minute Noodles (5 Pack)', price: 35.00 },
    ]
  },
  {
    id: 'cat_food',
    name: 'Late-Night Food',
    description: 'Craving takeaways? We\'ll fetch it.',
    icon: 'Pizza',
    baseFee: 25.00,
    items: [
      { id: 'item_5', name: 'McDonalds Big Mac Meal', price: 85.00 },
      { id: 'item_6', name: 'KFC Streetwise 2', price: 45.00 },
      { id: 'item_7', name: 'Steers Wacky Wednesday (If applicable)', price: 65.00 },
    ]
  },
  {
    id: 'cat_pharmacy',
    name: 'Pharmacy Essentials',
    description: 'Painkillers, vitamins, and first aid',
    icon: 'Pill',
    baseFee: 20.00,
    items: [
      { id: 'item_8', name: 'Panado (24 Pack)', price: 30.00 },
      { id: 'item_9', name: 'Cough Syrup', price: 55.00 },
      { id: 'item_10', name: 'Plasters', price: 15.00 },
    ]
  },
  {
    id: 'cat_laundry',
    name: 'Laundry Run',
    description: 'Drop off and pick up from the laundromat',
    icon: 'Shirt',
    baseFee: 35.00,
    items: [
      { id: 'item_11', name: 'Standard Wash & Fold (per load)', price: 60.00 },
      { id: 'item_12', name: 'Ironing (per item)', price: 10.00 },
    ]
  }
];

export const mockResidences = [
  { id: 'res_1', name: 'Noswal Hall', distanceKm: 0.5 },
  { id: 'res_2', name: 'South Point (Clifton Heights)', distanceKm: 0.8 },
  { id: 'res_3', name: 'Wits Junction', distanceKm: 2.1 },
  { id: 'res_4', name: 'Knockando Halls of Residence', distanceKm: 1.5 },
  { id: 'res_5', name: 'Yale Village', distanceKm: 1.8 },
];

export const mockUsers = [
  { id: 'user_admin', role: 'admin', name: 'Admin User', email: 'admin@resrunner.com' },
  { id: 'user_runner', role: 'runner', name: 'Speedy Gonzales', email: 'runner@resrunner.com', status: 'online' },
  { id: 'user_customer', role: 'customer', name: 'Jane Student', email: 'jane@student.wits.ac.za' },
];
