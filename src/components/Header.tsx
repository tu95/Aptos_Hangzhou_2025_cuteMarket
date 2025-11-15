import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
          <img 
            src="/website-logo.png" 
            alt="cuteMarket Logo" 
            className="h-16 w-16 object-contain drop-shadow-lg"
          />
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white">
              甜心市场cuteMarket
            </h1>
            <span className="text-white/80 text-sm">预测市场平台</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

