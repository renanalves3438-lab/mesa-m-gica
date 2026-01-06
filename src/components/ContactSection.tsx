import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Endereço",
      content: "Av. Paulista, 1000 - Centro",
      subtitle: "São Paulo - SP",
    },
    {
      icon: Clock,
      title: "Horário",
      content: "Terça a Domingo",
      subtitle: "18h às 00h",
    },
    {
      icon: Phone,
      title: "Telefone",
      content: "(11) 99999-9999",
      subtitle: "WhatsApp disponível",
    },
    {
      icon: Mail,
      title: "E-mail",
      content: "contato@restaurantemodelo.com.br",
      subtitle: "Reservas e eventos",
    },
  ];

  return (
    <section id="contato" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Entre em Contato</h2>
          <p className="section-subtitle">
            Estamos prontos para atendê-lo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 text-center hover-glow"
            >
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
              <p className="text-foreground">{info.content}</p>
              <p className="text-muted-foreground text-sm">{info.subtitle}</p>
            </motion.div>
          ))}
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card overflow-hidden rounded-2xl"
        >
          <div className="aspect-video bg-muted flex items-center justify-center relative">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Mapa interativo</p>
              <p className="text-sm text-muted-foreground">Av. Paulista, 1000 - São Paulo</p>
            </div>
            {/* Decorative grid */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }} />
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">Siga-nos nas redes sociais</p>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/50 hover:bg-primary/10 hover:border-primary"
              asChild
            >
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
