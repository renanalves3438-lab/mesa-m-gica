import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-restaurant.jpg";

const HeroSection = () => {
  const scrollToMenu = () => {
    document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Restaurante Modelo - Ambiente elegante"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-6"
          >
            ✨ Experiência Gastronômica Premium
          </motion.span>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Restaurante</span>
            <br />
            <span className="text-primary">Modelo</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Onde a tradição encontra a inovação. Pratos autorais com ingredientes selecionados em um ambiente único.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 gradient-primary hover:opacity-90 transition-opacity glow-border"
              onClick={scrollToMenu}
            >
              Ver Cardápio
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary"
              asChild
            >
              <a href="#reserva">Fazer Reserva</a>
            </Button>
          </div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            <div className="glass-card p-4 text-center">
              <p className="text-primary font-semibold">Horário</p>
              <p className="text-muted-foreground text-sm">Ter-Dom · 18h às 00h</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-primary font-semibold">Delivery</p>
              <p className="text-muted-foreground text-sm">Disponível via WhatsApp</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-primary font-semibold">Localização</p>
              <p className="text-muted-foreground text-sm">Centro · São Paulo</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button
            onClick={scrollToMenu}
            className="text-muted-foreground hover:text-primary transition-colors animate-bounce"
            aria-label="Rolar para o cardápio"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
