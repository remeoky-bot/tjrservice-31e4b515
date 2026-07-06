DROP POLICY IF EXISTS sales_all ON public.sales;
DROP POLICY IF EXISTS supp_all ON public.suppliers;

CREATE POLICY sales_rbac_select ON public.sales FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant') OR public.has_role(auth.uid(),'vendeur'));
CREATE POLICY sales_rbac_insert ON public.sales FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant') OR public.has_role(auth.uid(),'vendeur'));
CREATE POLICY sales_rbac_update ON public.sales FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant'));
CREATE POLICY sales_rbac_delete ON public.sales FOR DELETE TO authenticated
USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY supp_rbac_select ON public.suppliers FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant') OR public.has_role(auth.uid(),'magasinier'));
CREATE POLICY supp_rbac_write ON public.suppliers FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant'));