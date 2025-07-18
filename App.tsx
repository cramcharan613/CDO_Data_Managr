import { useEffect, memo } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider, useAppState, useAppActions } from "./contexts/AppContext";
import { PageErrorBoundary } from "./components/ErrorBoundary";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { AppRouter } from "./router/AppRouter";
import { usePerformanceMonitor } from "./hooks/usePerformanceOptimization";

const AppContent = memo(() => {
  const { currentTab, theme, sidebarCollapsed } = useAppState();
  const { setTheme } = useAppActions();
  const { markStart, markEnd } = usePerformanceMonitor('App');

  useEffect(() => {
    markStart('app-init');
    document.documentElement.classList.toggle("dark", theme === 'dark');
    markEnd('app-init', 100);
  }, [theme, markStart, markEnd]);

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const fullScreenPages = ["dashboard", "analysis"];
  const isFullScreen = fullScreenPages.includes(currentTab);

  return (
    <div className="min-h-screen bg-[#0a0b0f] dark">
      <div className="flex h-screen">
        {!isFullScreen && (
          <Sidebar
            activeTab={currentTab}
            onTabChange={() => {}}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isFullScreen && (
            <Header
              isDarkMode={theme === 'dark'}
              onToggleDarkMode={toggleDarkMode}
            />
          )}
          <main
            className={`flex-1 overflow-auto ${
              isFullScreen ? "bg-[#0a0b0f]" : "bg-background"
            }`}
          >
            <PageErrorBoundary pageName="App">
              <AppRouter />
            </PageErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  );
});

AppContent.displayName = 'AppContent';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
