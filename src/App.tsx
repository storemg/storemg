import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ProtectedRoute } from './components/ProtectedRoute'

import Header from './components/layout/Header'
import TopMarquee from './components/layout/TopMarquee'
import Footer from './components/layout/Footer'
import WhatsAppFloat from './components/layout/WhatsAppFloat'
import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Help from './pages/Help'
import Favorites from './pages/Favorites'

import AdminLogin from './pages/admin/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import ProductForm from './pages/admin/ProductForm'
import Stock from './pages/admin/Stock'
import Orders from './pages/admin/Orders'
import Categories from './pages/admin/Categories'
import Settings from './pages/admin/Settings'

function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="store-theme flex min-h-screen flex-col bg-slate-50 font-body text-slate-900">
      <TopMarquee />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <LoadingScreen />
          <Routes>
            {/* Loja pública */}
            <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
            <Route path="/catalogo" element={<StoreLayout><Catalog /></StoreLayout>} />
            <Route path="/produto/:id" element={<StoreLayout><ProductPage /></StoreLayout>} />
            <Route path="/carrinho" element={<StoreLayout><Cart /></StoreLayout>} />
            <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
            <Route path="/ajuda" element={<StoreLayout><Help /></StoreLayout>} />
            <Route path="/favoritos" element={<StoreLayout><Favorites /></StoreLayout>} />

            {/* Login do admin (fora da proteção, senão ninguém consegue logar) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Painel administrativo — tudo aqui dentro exige login + ser admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="produtos" element={<AdminProducts />} />
              <Route path="produtos/:id" element={<ProductForm />} />
              <Route path="estoque" element={<Stock />} />
              <Route path="pedidos" element={<Orders />} />
              <Route path="categorias" element={<Categories />} />
              <Route path="configuracoes" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}
