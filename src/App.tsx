import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProofPage } from './pages/ProofPage';
import { AdminPage } from './pages/AdminPage';

type RouteState =
  | { type: 'home' }
  | { type: 'proof'; customerId: string }
  | { type: 'admin' };

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => parseRoute());

  function parseRoute(): RouteState {
    const path = window.location.pathname;
    const hash = window.location.hash;

    // Check hash-based routing fallback (e.g. #/admin or #/proof/TC-1025)
    if (hash.startsWith('#/admin') || hash === '#admin') {
      return { type: 'admin' };
    }
    if (hash.startsWith('#/proof/')) {
      const id = hash.replace('#/proof/', '').trim();
      if (id) return { type: 'proof', customerId: decodeURIComponent(id) };
    }

    // Check standard pathname
    if (path.startsWith('/admin')) {
      return { type: 'admin' };
    }
    if (path.startsWith('/proof/')) {
      const id = path.replace('/proof/', '').trim();
      if (id) return { type: 'proof', customerId: decodeURIComponent(id) };
    }

    // Check query param fallback (?proof=TC-1025)
    const urlParams = new URLSearchParams(window.location.search);
    const proofParam = urlParams.get('proof') || urlParams.get('id');
    if (proofParam) {
      return { type: 'proof', customerId: proofParam.trim() };
    }

    return { type: 'home' };
  }

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = (url: string) => {
    window.history.pushState(null, '', url);
    setRoute(parseRoute());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    navigateTo('/');
  };

  const handleNavigateAdmin = () => {
    navigateTo('/admin');
  };

  const handleNavigateToProof = (customerId: string) => {
    navigateTo(`/proof/${encodeURIComponent(customerId)}`);
  };

  if (route.type === 'admin') {
    return (
      <AdminPage
        onNavigateHome={handleNavigateHome}
        onNavigateToProof={handleNavigateToProof}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      <Navbar
        onNavigateHome={handleNavigateHome}
        onNavigateAdmin={handleNavigateAdmin}
      />

      <main className="flex-1">
        {route.type === 'home' && (
          <HomePage onNavigateToProof={handleNavigateToProof} />
        )}

        {route.type === 'proof' && (
          <ProofPage
            customerId={route.customerId}
            onNavigateHome={handleNavigateHome}
          />
        )}
      </main>

      <Footer
        onNavigateHome={handleNavigateHome}
        onNavigateAdmin={handleNavigateAdmin}
      />
    </div>
  );
}
