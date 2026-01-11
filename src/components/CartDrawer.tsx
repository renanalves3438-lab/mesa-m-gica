import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal, totalItems, updateObservacoes } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg bg-card border-border flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Seu Pedido ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-muted-foreground"
              >
                <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                <p>Seu carrinho está vazio</p>
                <p className="text-sm">Adicione itens do cardápio</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-4"
                  >
                    <div className="flex gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                        <p className="text-primary font-semibold">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-auto text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Observações */}
                        <Input
                          placeholder="Observações (ex: sem cebola)"
                          value={item.observacoes || ''}
                          onChange={(e) => updateObservacoes(item.id, e.target.value)}
                          className="mt-2 text-sm bg-background/50"
                        />
                      </div>
                    </div>
                    
                    {/* Subtotal do item */}
                    <div className="flex justify-end mt-2 pt-2 border-t border-border/50">
                      <span className="text-sm text-muted-foreground">
                        Subtotal: <span className="text-foreground font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer with Total */}
        {items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleCheckout}
              className="w-full gradient-primary text-primary-foreground font-semibold py-6 glow-border"
            >
              Finalizar Pedido
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
