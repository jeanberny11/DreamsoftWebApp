
import React from 'react';

// ========================================
// COMPONENT PROPS
// ========================================

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

// ========================================
// AUTH LAYOUT COMPONENT
// ========================================

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = 'Bienveniod',
  subtitle = 'Inicie sesion para continuar',
}) => {
  return (
    <div className="min-h-screen flex">
      {/* ========================================
          LEFT SIDE - BRANDING & IMAGE
          ======================================== */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-primary-600">D</span>
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">DreamSoft</h1>
              <p className="text-teal-100 text-sm">Sistema de ventas y facturacion</p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mt-16">
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Maneje el negocio de sus suenos
              <br />
              Con nuestra plataforma todo-en-uno
            </h2>
            <p className="text-teal-100 text-lg leading-relaxed">
                Optimice sus ventas, inventario y relaciones con clientes
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="relative z-10 space-y-4">
          <FeatureItem
            icon="📊"
            text="Reportes de ventas y analiticas en tiempo real"
          />
          <FeatureItem
            icon="📦"
            text="Sistema de gestion de inventario integrado"
          />
          <FeatureItem
            icon="👥"
            text="Gestion de clientes y programas de fidelizacion"
          />
        </div>

        {/* Footer */}
        <div className="relative z-10 text-primary-100 text-sm">
          © 2025 DreamSoft. All rights reserved.
        </div>
      </div>

      {/* ========================================
          RIGHT SIDE - FORM CONTENT
          ======================================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md lg:max-w-xl">
          {/* Mobile Logo (only visible on small screens) */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white">D</span>
              </div>
              <h1 className="text-primary-600 text-xl font-bold">DreamSoft</h1>
            </div>
          </div>

          {/* Form Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {/* Form Content (Login, Register, Forgot Password) */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            {children}
          </div>

          {/* Footer Links (optional) */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Necesita ayuda?{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
              Contacte soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// FEATURE ITEM COMPONENT
// ========================================

interface FeatureItemProps {
  icon: string;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => {
  return (
    <div className="flex items-center space-x-3 text-white">
      <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>
      <p className="text-primary-50">{text}</p>
    </div>
  );
};

export default AuthLayout;