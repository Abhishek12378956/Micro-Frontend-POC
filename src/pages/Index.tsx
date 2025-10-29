import { useState, useEffect } from 'react';
import { Header } from '@/host/components/Header';
import { Navigation } from '@/host/components/Navigation';
import { AppLayout, AppContent } from '@/shared/components/AppLayout';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <AppLayout>
      <Header onMenuToggle={toggleMobileMenu} />
      <div className="flex h-[calc(100vh-4rem)] relative">
        {/* Mobile overlay */}
        {isMobile && isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div 
          className={cn(
            'fixed md:static z-30 h-full transition-all duration-300 ease-in-out w-64',
            isMobile && `w-full max-w-[100vw] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
          )}
        >
          <Navigation onNavigate={() => isMobile && setIsMobileMenuOpen(false)} />
        </div>

        {/* Main content */}
        <AppContent className={cn(
          'w-full transition-all duration-300',
          'md:ml-0', // Remove left margin on desktop
          isMobileMenuOpen ? 'ml-0' : '',
          isMobile && isMobileMenuOpen ? 'opacity-50' : 'opacity-100',
          'px-0 md:px-4' // Add horizontal padding on desktop only
        )}>
          <div className="h-full w-full max-w-full overflow-x-hidden">
            <Outlet />
          </div>
        </AppContent>
      </div>
    </AppLayout>
  );
};

export default Index;
