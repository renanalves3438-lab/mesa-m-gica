import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Área Administrativa
          </h1>
          <p className="text-muted-foreground mb-8">
            Para acessar o painel administrativo, é necessário ativar o Lovable Cloud
            e configurar a autenticação.
          </p>

          <div className="glass-card p-4 mb-6 bg-primary/10 border-primary/30">
            <p className="text-sm text-foreground">
              💡 <strong>Próximo passo:</strong> Ative o Lovable Cloud para adicionar
              autenticação, banco de dados e gerenciamento completo do restaurante.
            </p>
          </div>

          <Button
            variant="outline"
            className="border-primary/50 text-foreground hover:bg-primary/10"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao site
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
