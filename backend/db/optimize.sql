CREATE INDEX IF NOT EXISTS idx_orders_timestamp_desc
ON Orders (order_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_orders_employee_timestamp
ON Orders (employee_id, order_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_order_line_items_order_id
ON Order_Line_Items (order_id);

CREATE INDEX IF NOT EXISTS idx_line_item_add_ons_line_item_id
ON Line_Item_Add_Ons (line_item_id);

CREATE INDEX IF NOT EXISTS idx_menu_items_type_name
ON Menu_Items (item_type, item_name);

CREATE INDEX IF NOT EXISTS idx_inventory_item_name
ON Inventory (item_name);

CREATE INDEX IF NOT EXISTS idx_inventory_stock_delta_name
ON Inventory ((quantity_in_stock - reorder_level), item_name);

CREATE INDEX IF NOT EXISTS idx_employees_last_first
ON Employees (last_name, first_name);

ANALYZE Orders;
ANALYZE Order_Line_Items;
ANALYZE Line_Item_Add_Ons;
ANALYZE Menu_Items;
ANALYZE Inventory;
ANALYZE Employees;