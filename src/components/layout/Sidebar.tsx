import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Cable, Users, History, Menu, X } from 'lucide-react';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutGrid size={20} /> },
    { path: '/cables', label: 'Cables', icon: <Cable size={20} /> },
    { path: '/people', label: 'People', icon: <Users size={20} /> },
    { path: '/history', label: 'History', icon: <History size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-blue-600 text-white"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">Cable Manager</h1>
        </div>
        <nav className="flex-1 py-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="mb-1">
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full px-6 py-3 text-left transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
          <p>© 2025 Cable Manager</p>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h1 className="text-xl font-bold text-blue-600">Cable Manager</h1>
              <button onClick={toggleMobileMenu} className="text-gray-500">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 py-4">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.path} className="mb-1">
                    <button
                      onClick={() => {
                        navigate(item.path);
                        toggleMobileMenu();
                      }}
                      className={`flex items-center w-full px-6 py-3 text-left transition-colors ${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;