
import { Button } from 'primereact/button';


function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-card p-8 mb-6">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">
            DreamSoft WebApp
          </h1>
          <p className="text-gray-600 text-lg">
            Modern Teal Color Scheme - Sales & Inventory Management
          </p>
        </div>

        {/* Color Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Primary Colors Card */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Primary Colors</h2>
            <div className="space-y-3">
              <Button label="Primary Button (Teal)" className="w-full" />
              <Button label="Secondary Button (Emerald)" className="w-full" severity="secondary" />
              <Button label="Info Button" className="w-full" severity="info" />
            </div>
          </div>

          {/* Semantic Colors Card */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Semantic Colors</h2>
            <div className="space-y-3">
              <Button label="Success" className="w-full" severity="success" icon="pi pi-check" />
              <Button label="Warning" className="w-full" severity="warning" icon="pi pi-exclamation-triangle" />
              <Button label="Danger" className="w-full" severity="danger" icon="pi pi-times" />
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Badges</h2>
          <div className="flex flex-wrap gap-3">
            <span className="bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm font-medium">
              Active
            </span>
            <span className="bg-warning-100 text-warning-800 px-3 py-1 rounded-full text-sm font-medium">
              Pending
            </span>
            <span className="bg-error-100 text-error-800 px-3 py-1 rounded-full text-sm font-medium">
              Inactive
            </span>
            <span className="bg-info-100 text-info-800 px-3 py-1 rounded-full text-sm font-medium">
              Information
            </span>
            <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-card p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm">Total Sales</p>
                <h3 className="text-3xl font-bold mt-1">$24,500</h3>
              </div>
              <i className="pi pi-shopping-cart text-4xl text-primary-200"></i>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg shadow-card p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100 text-sm">Products</p>
                <h3 className="text-3xl font-bold mt-1">1,245</h3>
              </div>
              <i className="pi pi-box text-4xl text-secondary-200"></i>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg shadow-card p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-100 text-sm">Customers</p>
                <h3 className="text-3xl font-bold mt-1">892</h3>
              </div>
              <i className="pi pi-users text-4xl text-accent-200"></i>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Color scheme is ready! Check <code className="bg-gray-100 px-2 py-1 rounded text-primary-600">src/styles/COLOR_GUIDE.md</code> for usage guide.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;