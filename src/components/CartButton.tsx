import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const CartButton = () => {
  const { totalItems, setIsCartOpen, subtotal } = useCart();

  if (totalItems === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <Button
        onClick={() => setIsCartOpen(true)}
        className="gradient-primary text-primary-foreground font-semibold py-6 px-6 rounded-full shadow-2xl glow-border-strong flex items-center gap-3"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          <AnimatePresence>
            <motion.span
              key={totalItems}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center"
            >
              {totalItems}
            </motion.span>
          </AnimatePresence>
        </div>
        <span>Ver Carrinho</span>
        <span className="text-primary-foreground/90">
          R$ {subtotal.toFixed(2).replace('.', ',')}
        </span>
      </Button>
    </motion.div>
  );
};

export default CartButton;
