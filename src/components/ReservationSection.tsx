import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Users, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ReservationSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name.trim() || !formData.phone.trim() || !formData.date || !formData.time || !formData.guests) {
        toast({
          title: "Erro",
          description: "Por favor, preencha todos os campos.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const guestsNumber = parseInt(formData.guests, 10);
      if (isNaN(guestsNumber) || guestsNumber < 1 || guestsNumber > 20) {
        toast({
          title: "Erro",
          description: "Número de pessoas deve ser entre 1 e 20.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Insert reservation into database
      const { error } = await supabase.from("reservations").insert({
        nome: formData.name.trim(),
        telefone: formData.phone.trim(),
        data: formData.date,
        horario: formData.time,
        pessoas: guestsNumber,
        user_id: null, // Anonymous reservation
      });

      if (error) {
        console.error("Error creating reservation:", error);
        toast({
          title: "Erro ao criar reserva",
          description: "Ocorreu um erro ao processar sua reserva. Tente novamente.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Reserva solicitada!",
        description: "Entraremos em contato para confirmar sua reserva.",
      });

      setFormData({ name: "", phone: "", date: "", time: "", guests: "" });
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="reserva" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="section-title">Faça sua Reserva</h2>
            <p className="section-subtitle">
              Garanta sua mesa e tenha uma experiência inesquecível
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="glass-card p-8 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  WhatsApp
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  required
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Data
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Horário
                </Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Pessoas
                </Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.guests}
                  onChange={handleChange}
                  placeholder="2"
                  required
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full gradient-primary hover:opacity-90 transition-opacity text-lg py-6"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Solicitar Reserva
                </span>
              )}
            </Button>

            <p className="text-center text-muted-foreground text-sm">
              Você receberá uma confirmação via WhatsApp
            </p>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default ReservationSection;
