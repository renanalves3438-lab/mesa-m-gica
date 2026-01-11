-- =============================================
-- ENUM TYPES
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'cliente');
CREATE TYPE public.order_status AS ENUM ('pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado');
CREATE TYPE public.reservation_status AS ENUM ('pendente', 'confirmada', 'cancelada', 'concluida');

-- =============================================
-- PROFILES TABLE (user profile data)
-- =============================================
CREATE TABLE public.profiles (
    id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT,
    telefone TEXT,
    endereco TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- =============================================
-- USER ROLES TABLE (separate from profiles for security)
-- =============================================
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'cliente',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECURITY DEFINER FUNCTION TO CHECK ROLES
-- =============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Policy for user_roles: users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- MENU CATEGORIES TABLE
-- =============================================
CREATE TABLE public.menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    ordem INTEGER NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view active categories
CREATE POLICY "Anyone can view active categories"
ON public.menu_categories
FOR SELECT
USING (ativo = true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
ON public.menu_categories
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- MENU ITEMS TABLE
-- =============================================
CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    imagem_url TEXT,
    vegetariano BOOLEAN NOT NULL DEFAULT false,
    vegano BOOLEAN NOT NULL DEFAULT false,
    sem_lactose BOOLEAN NOT NULL DEFAULT false,
    popular BOOLEAN NOT NULL DEFAULT false,
    ativo BOOLEAN NOT NULL DEFAULT true,
    ordem INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view active menu items
CREATE POLICY "Anyone can view active menu items"
ON public.menu_items
FOR SELECT
USING (ativo = true);

-- Admins can manage menu items
CREATE POLICY "Admins can manage menu items"
ON public.menu_items
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RESERVATIONS TABLE
-- =============================================
CREATE TABLE public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    pessoas INTEGER NOT NULL DEFAULT 2,
    observacoes TEXT,
    status reservation_status NOT NULL DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Users can view their own reservations
CREATE POLICY "Users can view their own reservations"
ON public.reservations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create reservations
CREATE POLICY "Users can create reservations"
ON public.reservations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow anonymous reservations
CREATE POLICY "Anyone can create reservations"
ON public.reservations
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Admins can manage all reservations
CREATE POLICY "Admins can manage all reservations"
ON public.reservations
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    endereco TEXT,
    tipo TEXT NOT NULL DEFAULT 'delivery', -- 'delivery' or 'retirada'
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    taxa_entrega DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    observacoes TEXT,
    status order_status NOT NULL DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins can manage all orders
CREATE POLICY "Admins can manage all orders"
ON public.orders
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view items from their orders
CREATE POLICY "Users can view their order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- Users can insert items to their orders
CREATE POLICY "Users can insert their order items"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- Admins can manage all order items
CREATE POLICY "Admins can manage all order items"
ON public.order_items
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RESTAURANT SETTINGS TABLE (for admin configuration)
-- =============================================
CREATE TABLE public.restaurant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave TEXT NOT NULL UNIQUE,
    valor TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view settings
CREATE POLICY "Anyone can view settings"
ON public.restaurant_settings
FOR SELECT
USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage settings"
ON public.restaurant_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- TRIGGER FOR AUTOMATIC PROFILE CREATION
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, nome, telefone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.raw_user_meta_data ->> 'full_name'),
        NEW.raw_user_meta_data ->> 'telefone'
    );
    
    -- Assign default 'cliente' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'cliente');
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- TRIGGER FOR UPDATED_AT COLUMNS
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at
    BEFORE UPDATE ON public.menu_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurant_settings_updated_at
    BEFORE UPDATE ON public.restaurant_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();