-- Allow anonymous users to create orders (when user_id is null)
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
WITH CHECK (user_id IS NULL);

-- Allow anyone to view orders they just created (by matching the order they just inserted)
-- This is needed so the .select().single() returns the order after insert
CREATE POLICY "Anyone can view their anonymous orders"
ON public.orders
FOR SELECT
USING (user_id IS NULL);

-- Allow anonymous order items insertion (when the order has no user_id)
CREATE POLICY "Anyone can insert order items for anonymous orders"
ON public.order_items
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id IS NULL
));

-- Allow viewing order items for anonymous orders
CREATE POLICY "Anyone can view order items for anonymous orders"
ON public.order_items
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id IS NULL
));