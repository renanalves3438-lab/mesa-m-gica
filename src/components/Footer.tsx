import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">
              Restaurante<span className="text-primary">.</span>
            </span>
          </div>

          <p className="text-muted-foreground text-sm text-center">
            © {currentYear} Restaurante Modelo. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/auth"
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              Área Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
