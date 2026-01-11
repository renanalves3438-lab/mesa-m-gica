import { motion } from "framer-motion";
import { useState } from "react";
import { Leaf, Fish, Flame, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import dishSteak from "@/assets/dish-steak.jpg";
import dishSalmon from "@/assets/dish-salmon.jpg";
import dishRisotto from "@/assets/dish-risotto.jpg";
import dishDessert from "@/assets/dish-dessert.jpg";

type Category = "todos" | "entradas" | "principais" | "sobremesas" | "bebidas";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  tags: string[];
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Filé Mignon ao Molho",
    description: "Corte premium grelhado com manteiga de ervas, acompanhado de legumes salteados e purê trufado.",
    price: 89.90,
    category: "principais",
    image: dishSteak,
    tags: ["popular"],
  },
  {
    id: 2,
    name: "Salmão Grelhado",
    description: "Salmão fresco com aspargos, molho de limão siciliano e toque de ervas finas.",
    price: 79.90,
    category: "principais",
    image: dishSalmon,
    tags: ["peixe"],
  },
  {
    id: 3,
    name: "Risotto de Cogumelos",
    description: "Risoto cremoso com mix de cogumelos frescos, parmesão e finalizado com azeite trufado.",
    price: 59.90,
    category: "principais",
    image: dishRisotto,
    tags: ["vegetariano"],
  },
  {
    id: 4,
    name: "Petit Gâteau",
    description: "Bolo quente de chocolate belga com interior cremoso, servido com sorvete de baunilha.",
    price: 32.90,
    category: "sobremesas",
    image: dishDessert,
    tags: ["popular"],
  },
  {
    id: 5,
    name: "Carpaccio de Wagyu",
    description: "Finas fatias de carne wagyu com rúcula, parmesão e azeite extra virgem.",
    price: 68.90,
    category: "entradas",
    image: dishSteak,
    tags: ["especial"],
  },
  {
    id: 6,
    name: "Camarão Flamejado",
    description: "Camarões grandes flamejados no conhaque com alho, tomate e ervas frescas.",
    price: 74.90,
    category: "entradas",
    image: dishSalmon,
    tags: ["frutos-do-mar"],
  },
];

const categories = [
  { id: "todos" as Category, label: "Todos" },
  { id: "entradas" as Category, label: "Entradas" },
  { id: "principais" as Category, label: "Principais" },
  { id: "sobremesas" as Category, label: "Sobremesas" },
  { id: "bebidas" as Category, label: "Bebidas" },
];

const getTagIcon = (tag: string) => {
  switch (tag) {
    case "vegetariano":
      return <Leaf className="w-4 h-4" />;
    case "peixe":
    case "frutos-do-mar":
      return <Fish className="w-4 h-4" />;
    case "popular":
    case "especial":
      return <Flame className="w-4 h-4" />;
    default:
      return null;
  }
};

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("todos");
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { addItem, setIsCartOpen } = useCart();

  const filteredItems = activeCategory === "todos"
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const getQuantity = (id: number) => quantities[id] || 1;

  const setQuantity = (id: number, qty: number) => {
    if (qty >= 1) {
      setQuantities(prev => ({ ...prev, [id]: qty }));
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    const qty = getQuantity(item.id);
    addItem({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      image: item.image,
    }, qty);
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
    setIsCartOpen(true);
  };

  return (
    <section id="cardapio" className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Nosso Cardápio</h2>
          <p className="section-subtitle">
            Pratos preparados com ingredientes frescos e técnicas refinadas
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? "gradient-primary text-primary-foreground glow-border"
                  : "glass-card text-foreground hover:border-primary/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="menu-item-card group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                
                {/* Tags */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium flex items-center gap-1"
                    >
                      {getTagIcon(tag)}
                      {tag === "vegetariano" && "Vegetariano"}
                      {tag === "popular" && "Popular"}
                      {tag === "especial" && "Especial"}
                      {tag === "peixe" && "Peixe"}
                      {tag === "frutos-do-mar" && "Frutos do Mar"}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                  <span className="text-primary font-bold text-lg whitespace-nowrap">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Add to Cart Controls */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuantity(item.id, getQuantity(item.id) - 1);
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium text-foreground">
                      {getQuantity(item.id)}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuantity(item.id, getQuantity(item.id) + 1);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="gradient-primary text-primary-foreground font-medium flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">
              Nenhum item encontrado nesta categoria.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
