import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CreditCard, Banknote, QrCode, Truck, Store, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const checkoutSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().min(10, "Telefone inválido").max(15),
  tipo: z.enum(["entrega", "retirada"]),
  endereco: z.string().optional(),
  formaPagamento: z.enum(["pix", "cartao", "dinheiro"]),
  trocoPara: z.string().optional(),
  observacoes: z.string().optional(),
}).refine((data) => {
  if (data.tipo === "entrega" && (!data.endereco || data.endereco.length < 10)) {
    return false;
  }
  return true;
}, {
  message: "Endereço é obrigatório para entregas",
  path: ["endereco"],
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const TAXA_ENTREGA = 8.00;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      tipo: "retirada",
      endereco: "",
      formaPagamento: "pix",
      trocoPara: "",
      observacoes: "",
    },
  });

  const tipoEntrega = form.watch("tipo");
  const formaPagamento = form.watch("formaPagamento");
  const taxaEntrega = tipoEntrega === "entrega" ? TAXA_ENTREGA : 0;
  const total = subtotal + taxaEntrega;

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          nome: data.nome,
          telefone: data.telefone,
          tipo: data.tipo,
          endereco: data.tipo === "entrega" ? data.endereco : null,
          observacoes: data.observacoes || null,
          subtotal: subtotal,
          taxa_entrega: taxaEntrega,
          total: total,
          status: "pendente",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        menu_item_id: null, // Could be linked to menu_items if using DB menu
        nome: item.name,
        preco_unitario: item.price,
        quantidade: item.quantity,
        subtotal: item.price * item.quantity,
        observacoes: item.observacoes || null,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderId(order.id);
      setOrderComplete(true);
      clearCart();

      toast({
        title: "Pedido realizado!",
        description: "Seu pedido foi recebido e está sendo processado.",
      });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast({
        title: "Erro ao criar pedido",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">Pedido Confirmado!</h1>
          <p className="text-muted-foreground mb-6">
            Seu pedido #{orderId?.slice(0, 8).toUpperCase()} foi recebido com sucesso.
          </p>
          
          <div className="glass-card p-4 mb-6 text-left">
            <p className="text-sm text-muted-foreground mb-2">Total do pedido:</p>
            <p className="text-2xl font-bold text-primary">R$ {total.toFixed(2).replace('.', ',')}</p>
          </div>
          
          <Button 
            onClick={() => navigate('/')}
            className="w-full gradient-primary text-primary-foreground"
          >
            Voltar ao Início
          </Button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8 max-w-md w-full text-center"
        >
          <h1 className="text-2xl font-bold text-foreground mb-4">Carrinho Vazio</h1>
          <p className="text-muted-foreground mb-6">
            Adicione itens do cardápio para fazer um pedido.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="gradient-primary text-primary-foreground"
          >
            Ver Cardápio
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Finalizar Pedido</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Dados pessoais */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Dados para contato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} className="bg-background" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone / WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} className="bg-background" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Tipo de entrega */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Tipo de pedido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-2 gap-4"
                            >
                              <Label
                                htmlFor="retirada"
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  field.value === "retirada"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <RadioGroupItem value="retirada" id="retirada" className="sr-only" />
                                <Store className="w-6 h-6 text-primary" />
                                <span className="font-medium text-foreground">Retirada</span>
                                <span className="text-xs text-muted-foreground">Grátis</span>
                              </Label>
                              <Label
                                htmlFor="entrega"
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  field.value === "entrega"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <RadioGroupItem value="entrega" id="entrega" className="sr-only" />
                                <Truck className="w-6 h-6 text-primary" />
                                <span className="font-medium text-foreground">Entrega</span>
                                <span className="text-xs text-muted-foreground">R$ {TAXA_ENTREGA.toFixed(2).replace('.', ',')}</span>
                              </Label>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {tipoEntrega === "entrega" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <FormField
                          control={form.control}
                          name="endereco"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Endereço completo</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Rua, número, bairro, complemento..." 
                                  {...field} 
                                  className="bg-background"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* Forma de pagamento */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Forma de pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="formaPagamento"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-3 gap-4"
                            >
                              <Label
                                htmlFor="pix"
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  field.value === "pix"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <RadioGroupItem value="pix" id="pix" className="sr-only" />
                                <QrCode className="w-6 h-6 text-primary" />
                                <span className="font-medium text-foreground text-sm">PIX</span>
                              </Label>
                              <Label
                                htmlFor="cartao"
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  field.value === "cartao"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <RadioGroupItem value="cartao" id="cartao" className="sr-only" />
                                <CreditCard className="w-6 h-6 text-primary" />
                                <span className="font-medium text-foreground text-sm">Cartão</span>
                              </Label>
                              <Label
                                htmlFor="dinheiro"
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  field.value === "dinheiro"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <RadioGroupItem value="dinheiro" id="dinheiro" className="sr-only" />
                                <Banknote className="w-6 h-6 text-primary" />
                                <span className="font-medium text-foreground text-sm">Dinheiro</span>
                              </Label>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {formaPagamento === "dinheiro" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <FormField
                          control={form.control}
                          name="trocoPara"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Troco para</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="R$ 100,00" 
                                  {...field} 
                                  className="bg-background"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* Observações */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="observacoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Alguma observação sobre o pedido?" 
                              {...field} 
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Submit button - mobile */}
                <div className="lg:hidden">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gradient-primary text-primary-foreground font-semibold py-6 glow-border"
                  >
                    {isSubmitting ? "Processando..." : `Confirmar Pedido • R$ ${total.toFixed(2).replace('.', ',')}`}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-8 h-fit"
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-foreground">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
                
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de entrega</span>
                    <span className="text-foreground">
                      {taxaEntrega > 0 ? `R$ ${taxaEntrega.toFixed(2).replace('.', ',')}` : "Grátis"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                {/* Submit button - desktop */}
                <div className="hidden lg:block pt-4">
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="w-full gradient-primary text-primary-foreground font-semibold py-6 glow-border"
                  >
                    {isSubmitting ? "Processando..." : "Confirmar Pedido"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
