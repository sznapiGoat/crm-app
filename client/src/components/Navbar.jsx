import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/clients', label: 'Clients' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">
        CRM App
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          {links.map(({ to, label }) => {
            const active = pathname === to || (to !== '/' && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <span className="text-sm text-slate-500 hidden sm:block">{user.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
