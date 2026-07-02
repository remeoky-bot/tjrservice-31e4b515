
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin','gerant','vendeur','technicien','magasinier');
CREATE TYPE public.repair_status AS ENUM ('recu','diagnostic','devis','en_reparation','pret','restitue','annule');
CREATE TYPE public.sale_payment AS ENUM ('especes','mvola','orange_money','airtel_money','virement','carte');
CREATE TYPE public.product_condition AS ENUM ('neuf','reconditionne','occasion');
CREATE TYPE public.stock_move_type AS ENUM ('entree','sortie','ajustement','vente','reparation');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self_read" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "roles_read_all" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "roles_admin_manage" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Auto-create profile + assign first user as admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE user_count INT;
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);
  SELECT count(*) INTO user_count FROM public.user_roles;
  IF user_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'vendeur');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SHOPS ============
CREATE TABLE public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shops TO authenticated;
GRANT ALL ON public.shops TO service_role;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shops_read" ON public.shops FOR SELECT TO authenticated USING (true);
CREATE POLICY "shops_admin_write" ON public.shops FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant'));

-- ============ CATALOG ============
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'phone'
);
CREATE TABLE public.phone_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands ON DELETE CASCADE,
  name TEXT NOT NULL,
  UNIQUE (brand_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.phone_models TO authenticated;
GRANT ALL ON public.brands, public.phone_models TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands_read" ON public.brands FOR SELECT TO authenticated USING (true);
CREATE POLICY "brands_write" ON public.brands FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant') OR public.has_role(auth.uid(),'magasinier'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant') OR public.has_role(auth.uid(),'magasinier'));
CREATE POLICY "models_read" ON public.phone_models FOR SELECT TO authenticated USING (true);
CREATE POLICY "models_write" ON public.phone_models FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant') OR public.has_role(auth.uid(),'magasinier'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant') OR public.has_role(auth.uid(),'magasinier'));

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'phone',
  brand_id UUID REFERENCES public.brands ON DELETE SET NULL,
  model_id UUID REFERENCES public.phone_models ON DELETE SET NULL,
  storage TEXT,
  ram TEXT,
  color TEXT,
  condition product_condition,
  imei TEXT,
  purchase_price NUMERIC(14,2) NOT NULL DEFAULT 0,
  sale_price NUMERIC(14,2) NOT NULL DEFAULT 0,
  stock_qty INT NOT NULL DEFAULT 0,
  min_stock INT NOT NULL DEFAULT 0,
  shop_id UUID REFERENCES public.shops ON DELETE SET NULL,
  supplier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX products_name_idx ON public.products USING gin (to_tsvector('simple', name));
CREATE INDEX products_sku_idx ON public.products (sku);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_read" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "products_write" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant') OR public.has_role(auth.uid(),'magasinier'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gerant') OR public.has_role(auth.uid(),'magasinier'));

-- ============ STOCK MOVEMENTS ============
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products ON DELETE CASCADE,
  move_type stock_move_type NOT NULL,
  qty INT NOT NULL,
  reason TEXT,
  reference TEXT,
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.stock_movements TO authenticated;
GRANT ALL ON public.stock_movements TO service_role;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sm_read" ON public.stock_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "sm_write" ON public.stock_movements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ============ CUSTOMERS & SUPPLIERS ============
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers TO authenticated;
GRANT ALL ON public.customers, public.suppliers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cust_all" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "supp_all" ON public.suppliers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ SALES ============
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL DEFAULT ('V-' || to_char(now(),'YYYYMMDDHH24MISS')),
  customer_id UUID REFERENCES public.customers ON DELETE SET NULL,
  shop_id UUID REFERENCES public.shops ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users,
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  discount NUMERIC(14,2) NOT NULL DEFAULT 0,
  total NUMERIC(14,2) NOT NULL DEFAULT 0,
  payment_method sale_payment NOT NULL DEFAULT 'especes',
  status TEXT NOT NULL DEFAULT 'paid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales ON DELETE CASCADE,
  product_id UUID REFERENCES public.products ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  qty INT NOT NULL,
  unit_price NUMERIC(14,2) NOT NULL,
  line_total NUMERIC(14,2) NOT NULL
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sale_items TO authenticated;
GRANT ALL ON public.sales, public.sale_items TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sales_all" ON public.sales FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "sale_items_all" ON public.sale_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ REPAIRS ============
CREATE TABLE public.repairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL DEFAULT ('R-' || to_char(now(),'YYYYMMDDHH24MISS')),
  customer_id UUID REFERENCES public.customers ON DELETE SET NULL,
  device_brand TEXT,
  device_model TEXT,
  imei TEXT,
  reported_issue TEXT NOT NULL,
  diagnostic TEXT,
  quote_amount NUMERIC(14,2) DEFAULT 0,
  final_amount NUMERIC(14,2) DEFAULT 0,
  status repair_status NOT NULL DEFAULT 'recu',
  technician_id UUID REFERENCES auth.users,
  shop_id UUID REFERENCES public.shops ON DELETE SET NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ready_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  notes TEXT
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.repairs TO authenticated;
GRANT ALL ON public.repairs TO service_role;
ALTER TABLE public.repairs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "repairs_all" ON public.repairs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ TRIGGERS ============
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER products_touch BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Auto-update stock on movements
CREATE OR REPLACE FUNCTION public.apply_stock_movement()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.move_type IN ('entree') THEN
    UPDATE public.products SET stock_qty = stock_qty + NEW.qty WHERE id = NEW.product_id;
  ELSIF NEW.move_type IN ('sortie','vente','reparation') THEN
    UPDATE public.products SET stock_qty = stock_qty - NEW.qty WHERE id = NEW.product_id;
  ELSIF NEW.move_type = 'ajustement' THEN
    UPDATE public.products SET stock_qty = NEW.qty WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER stock_movements_apply AFTER INSERT ON public.stock_movements
FOR EACH ROW EXECUTE FUNCTION public.apply_stock_movement();

-- ============ SEED CATALOGUE ============
INSERT INTO public.shops (name, address, phone) VALUES ('Boutique Principale','Antananarivo','+261 34 79 333 70');

INSERT INTO public.brands (name, category) VALUES
 ('iPhone','phone'),('Samsung','phone'),('Xiaomi','phone'),('Redmi','phone'),
 ('Tecno','phone'),('Infinix','phone'),('Itel','phone'),('Oppo','phone'),
 ('Realme','phone'),('Huawei','phone'),('Honor','phone'),('Nokia','phone');

-- iPhone models
INSERT INTO public.phone_models (brand_id, name)
SELECT b.id, m FROM public.brands b, unnest(ARRAY['11','11 Pro','12','12 Pro','13','13 Pro','14','14 Pro','15','15 Pro','16','16 Pro']) m WHERE b.name='iPhone';

-- Samsung
INSERT INTO public.phone_models (brand_id, name)
SELECT b.id, m FROM public.brands b, unnest(ARRAY['A05','A15','A25','A35','A55','S22','S23','S24','S25']) m WHERE b.name='Samsung';

-- Redmi
INSERT INTO public.phone_models (brand_id, name)
SELECT b.id, m FROM public.brands b, unnest(ARRAY['10','11','12','13','14C','Note 10','Note 11','Note 12','Note 13','Note 14','Note 14 Pro']) m WHERE b.name='Redmi';

-- Tecno / Infinix / Itel
INSERT INTO public.phone_models (brand_id, name)
SELECT b.id, m FROM public.brands b, unnest(ARRAY['Spark 10','Spark 20','Camon 20','Pova 5','Pop 8']) m WHERE b.name='Tecno';
INSERT INTO public.phone_models (brand_id, name)
SELECT b.id, m FROM public.brands b, unnest(ARRAY['Hot 30','Hot 40','Smart 8','Note 30','Note 40']) m WHERE b.name='Infinix';
INSERT INTO public.phone_models (brand_id, name)
SELECT b.id, m FROM public.brands b, unnest(ARRAY['A18','A50','A70','P40','Vision 3']) m WHERE b.name='Itel';
