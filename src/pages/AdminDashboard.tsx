import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Calendar,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalReservations: number;
  totalOrders: number;
  pendingReservations: number;
  pendingOrders: number;
}

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<Stats>({
    totalReservations: 0,
    totalOrders: 0,
    pendingReservations: 0,
    pendingOrders: 0,
  });

  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [reservations, orders, pendingRes, pendingOrd] = await Promise.all([
        supabase.from("reservations").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase
          .from("reservations")
          .select("id", { count: "exact", head: true })
          .eq("status", "pendente"),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("status", "pendente"),
      ]);

      setStats({
        totalReservations: reservations.count || 0,
        totalOrders: orders.count || 0,
        pendingReservations: pendingRes.count || 0,
        pendingOrders: pendingOrd.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "menu", label: "Cardápio", icon: UtensilsCrossed },
    { id: "reservations", label: "Reservas", icon: Calendar },
    { id: "orders", label: "Pedidos", icon: ShoppingBag },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const statCards = [
    {
      title: "Total de Reservas",
      value: stats.totalReservations,
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total de Pedidos",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Reservas Pendentes",
      value: stats.pendingReservations,
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Pedidos Pendentes",
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold text-gradient">Admin Panel</h1>
            <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-secondary rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <div className="w-10" />
        </div>

        {/* Dashboard content */}
        {activeTab === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Bem-vindo de volta!
              </h2>
              <p className="text-muted-foreground">
                Aqui está um resumo do seu restaurante
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-foreground mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                🚧 Em Desenvolvimento
              </h3>
              <p className="text-muted-foreground">
                Os módulos de gerenciamento de cardápio, reservas, pedidos e
                configurações estão em desenvolvimento. Volte em breve para mais
                funcionalidades!
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === "menu" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              Gerenciar Cardápio
            </h2>
            <p className="text-muted-foreground">
              Adicione, edite ou remova itens do cardápio. Funcionalidade em
              desenvolvimento.
            </p>
          </motion.div>
        )}

        {activeTab === "reservations" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              Gerenciar Reservas
            </h2>
            <p className="text-muted-foreground">
              Visualize e gerencie as reservas do restaurante. Funcionalidade em
              desenvolvimento.
            </p>
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              Gerenciar Pedidos
            </h2>
            <p className="text-muted-foreground">
              Visualize e gerencie os pedidos. Funcionalidade em desenvolvimento.
            </p>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              Configurações
            </h2>
            <p className="text-muted-foreground">
              Configure as informações do restaurante. Funcionalidade em
              desenvolvimento.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
