import { Button } from 'primereact/button';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          DreamSoft Frontend
        </h1>
        <p className="text-gray-600 mb-4">
          Tailwind CSS is working! ✅
        </p>
        <Button label="PrimeReact Button" icon="pi pi-check" className="p-button-success" />
      </div>
    </div>
  );
}

export default App;