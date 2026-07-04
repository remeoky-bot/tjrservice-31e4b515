-- Profiles: users can only read their own profile
DROP POLICY IF EXISTS profiles_self_read ON public.profiles;
CREATE POLICY profiles_self_read ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Customers: restrict CRUD to staff roles only
DROP POLICY IF EXISTS cust_all ON public.customers;
CREATE POLICY customers_staff_read ON public.customers
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gerant') OR
    public.has_role(auth.uid(), 'vendeur') OR
    public.has_role(auth.uid(), 'technicien')
  );
CREATE POLICY customers_staff_insert ON public.customers
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gerant') OR
    public.has_role(auth.uid(), 'vendeur')
  );
CREATE POLICY customers_staff_update ON public.customers
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gerant') OR
    public.has_role(auth.uid(), 'vendeur')
  );
CREATE POLICY customers_admin_delete ON public.customers
  FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gerant')
  );

-- Sale items: restrict to staff roles
DROP POLICY IF EXISTS sale_items_all ON public.sale_items;
CREATE POLICY sale_items_staff_read ON public.sale_items
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gerant') OR
    public.has_role(auth.uid(), 'vendeur') OR
    public.has_role(auth.uid(), 'magasinier')
  );
CREATE POLICY sale_items_staff_write ON public.sale_items
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gerant') OR
    public.has_role(auth.uid(), 'vendeur')
  );
CREATE POLICY sale_items_staff_update ON public.sale_items
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gerant') OR
    public.has_role(auth.uid(), 'vendeur')
  );
CREATE POLICY sale_items_admin_delete ON public.sale_items
  FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gerant')
  );