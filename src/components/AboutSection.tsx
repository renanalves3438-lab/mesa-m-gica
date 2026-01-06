import { motion } from "framer-motion";
import { Award, Users, Clock, Sparkles } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: "Qualidade Premium",
      description: "Ingredientes selecionados dos melhores fornecedores.",
    },
    {
      icon: Users,
      title: "Equipe Especializada",
      description: "Chefs premiados com experiência internacional.",
    },
    {
      icon: Clock,
      title: "Tradição desde 2010",
      description: "Mais de uma década de experiência gastronômica.",
    },
    {
      icon: Sparkles,
      title: "Ambiente Único",
      description: "Decoração moderna e atmosfera acolhedora.",
    },
  ];

  return (
    <section id="sobre" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Nossa História</h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Há mais de uma década, o Restaurante Modelo se dedica a criar
              experiências gastronômicas memoráveis. Nossa cozinha combina
              técnicas clássicas com toques contemporâneos, sempre respeitando
              a qualidade dos ingredientes.
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Cada prato é preparado com paixão e atenção aos detalhes,
              refletindo nosso compromisso com a excelência culinária e o
              bem-estar de nossos clientes.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="glass-card p-8 text-center hover-glow">
              <span className="text-5xl font-bold text-primary">14+</span>
              <p className="text-muted-foreground mt-2">Anos de experiência</p>
            </div>
            <div className="glass-card p-8 text-center hover-glow">
              <span className="text-5xl font-bold text-primary">50k+</span>
              <p className="text-muted-foreground mt-2">Clientes satisfeitos</p>
            </div>
            <div className="glass-card p-8 text-center hover-glow">
              <span className="text-5xl font-bold text-primary">30+</span>
              <p className="text-muted-foreground mt-2">Pratos exclusivos</p>
            </div>
            <div className="glass-card p-8 text-center hover-glow">
              <span className="text-5xl font-bold text-primary">4.9</span>
              <p className="text-muted-foreground mt-2">Avaliação Google</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
