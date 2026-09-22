export const verificationPlans = {
  kiosk: {
    id: 'kiosk',
    title: 'Acceptance Criteria Verification: Customer Kiosk',
    route: '/kiosk',
    items: [
      {
        id: 'kiosk-loads',
        label: 'Kiosk loads without staff login',
        expected: 'Customer kiosk opens directly and does not require OAuth or PIN.',
      },
      {
        id: 'kiosk-menu',
        label: 'Menu items and prices render correctly',
        expected: 'Drinks display in the menu grid with prices.',
      },
      {
        id: 'kiosk-customization',
        label: 'Drink customization works',
        expected: 'Opening a drink shows ice, sugar, and add-on controls.',
      },
      {
        id: 'kiosk-cart',
        label: 'Cart updates correctly',
        expected: 'Adding/removing items changes the cart count and total.',
      },
      {
        id: 'kiosk-order-submit',
        label: 'Order submission succeeds',
        expected: 'Place Order creates an order and shows confirmation/receipt.',
      },
      {
        id: 'kiosk-weather',
        label: 'Weather recommendation appears',
        expected: 'Weather widget/banner loads and shows a suggestion.',
      },
      {
        id: 'kiosk-translate',
        label: 'Language selector triggers translation',
        expected: 'Changing language sends translation requests and updates labels when available.',
      },
      {
        id: 'kiosk-accessibility',
        label: 'Accessibility controls work',
        expected: 'Contrast/text size controls change appearance and persist.',
      },
    ],
  },

  cashier: {
    id: 'cashier',
    title: 'Acceptance Criteria Verification: Cashier POS',
    route: '/cashier',
    items: [
      {
        id: 'cashier-auth',
        label: 'Cashier access requires cashier login',
        expected: 'Cashier page redirects unauthorized users to login.',
      },
      {
        id: 'cashier-categories',
        label: 'Category tabs filter drinks',
        expected: 'Tabs like Milk Tea / Slush / Smoothie update the visible menu.',
      },
      {
        id: 'cashier-customization',
        label: 'Customization modal works',
        expected: 'Cashier can set ice, sugar, and add-ons before adding to order.',
      },
      {
        id: 'cashier-cart',
        label: 'Current order panel updates',
        expected: 'Cart shows line items, add-ons, and total correctly.',
      },
      {
        id: 'cashier-checkout',
        label: 'Checkout creates order',
        expected: 'Checkout posts the order successfully and shows confirmation.',
      },
      {
        id: 'cashier-receipt',
        label: 'Receipt can be viewed after checkout',
        expected: 'View Last Receipt opens the receipt modal.',
      },
      {
        id: 'cashier-touch-friendly',
        label: 'Cashier UI is touch-friendly',
        expected: 'Buttons, tabs, and checkout controls are large enough for touchscreen use.',
      },
    ],
  },

  manager: {
    id: 'manager',
    title: 'Acceptance Criteria Verification: Manager Dashboard',
    route: '/manager',
    items: [
      {
        id: 'manager-auth',
        label: 'Manager access requires manager login',
        expected: 'Manager page redirects unauthorized users to login.',
      },
      {
        id: 'manager-summary',
        label: 'Summary cards render correctly',
        expected: 'Revenue, orders, average order, and low stock metrics display.',
      },
      {
        id: 'manager-sales',
        label: 'Daily sales summary displays correctly',
        expected: 'Sales summary table shows date, order count, and revenue.',
      },
      {
        id: 'manager-low-stock',
        label: 'Low stock section renders correctly',
        expected: 'Low stock items appear when inventory is below threshold.',
      },
      {
        id: 'manager-orders',
        label: 'Recent orders table renders correctly',
        expected: 'Recent orders table lists order id, timestamp, employee, and total.',
      },
      {
        id: 'manager-refresh',
        label: 'Refresh dashboard updates data',
        expected: 'Refresh button reloads data and updates last refreshed message.',
      },
      {
        id: 'manager-accessibility',
        label: 'Accessibility controls work',
        expected: 'Contrast/text size controls change appearance and persist.',
      },
    ],
  },
};