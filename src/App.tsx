import React, { useState } from 'react';
import { useSmartMachinesData } from './hooks/useSmartMachinesData';
import { ActiveTab } from './types/machine';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { OfflineBanner } from './components/Common/OfflineBanner';
import { MachineDetailModal } from './components/MachineDetailModal';
import { Footer } from './components/Common/Footer';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { MachinesPage } from './pages/MachinesPage';
import { TelemetryPage } from './pages/TelemetryPage';
import { PredictiveMaintenancePage } from './pages/PredictiveMaintenancePage';
import { PartsQuotesPage } from './pages/PartsQuotesPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { SystemPage } from './pages/SystemPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    machines,
    allMachines,
    plantSummary,
    telemetry,
    parts,
    aiInsights,
    filters,
    setFilters,
    selectedMachine,
    setSelectedMachineId,
    appMode,
    isFirebaseActive,
    isDemoActive,
    lastSyncTime,
    reloadData,
  } = useSmartMachinesData();

  // Encontra a cotação e o insight para a máquina selecionada
  const selectedQuote = selectedMachine
    ? parts.find((p) => p.part_code === selectedMachine.codigo_peca_reposicao)
    : undefined;

  const selectedInsight = selectedMachine
    ? aiInsights.find((ins) => ins.machine_id === selectedMachine.maquina_id)
    : undefined;

  const handleClearFilters = () => {
    setFilters({
      linha: 'ALL',
      turno: 'ALL',
      status: 'ALL',
      searchQuery: '',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Header Superior com Indicadores de Conexão */}
      <Header
        isFirebaseActive={isFirebaseActive}
        isDemoActive={isDemoActive}
        lastSyncTime={lastSyncTime}
        onRefresh={reloadData}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex-1 flex w-full">
        {/* Sidebar Lateral Responsiva */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Conteúdo Principal Fluido e Adaptável */}
        <main className="flex-1 p-3 sm:p-4 lg:p-5 max-w-[1550px] mx-auto w-full">
          {/* Banner de Modo Offline / Demo */}
          <OfflineBanner
            appMode={appMode}
            isFirebaseActive={isFirebaseActive}
            isDemoActive={isDemoActive}
          />

          {/* Barra de Filtros Globais (visível nas telas que usam lista de máquinas) */}
          {['overview', 'machines', 'telemetry', 'predictive'].includes(activeTab) && (
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              totalFiltered={machines.length}
              totalTotal={allMachines.length}
            />
          )}

          {/* Renderização Condicional da Aba Ativa */}
          {activeTab === 'overview' && (
            <OverviewPage
              machines={machines}
              allMachines={allMachines.length}
              onSelectMachine={setSelectedMachineId}
            />
          )}

          {activeTab === 'machines' && (
            <MachinesPage
              machines={machines}
              totalAll={allMachines.length}
              onSelectMachine={setSelectedMachineId}
              onClearFilters={handleClearFilters}
            />
          )}

          {activeTab === 'telemetry' && (
            <TelemetryPage
              machines={machines}
              telemetry={telemetry}
              onSelectMachine={setSelectedMachineId}
            />
          )}

          {activeTab === 'predictive' && (
            <PredictiveMaintenancePage
              machines={machines}
              onSelectMachine={setSelectedMachineId}
            />
          )}

          {activeTab === 'parts' && (
            <PartsQuotesPage
              parts={parts}
              onRefreshQuotes={reloadData}
            />
          )}

          {activeTab === 'insights' && (
            <AIInsightsPage
              insights={aiInsights}
              onSelectMachine={setSelectedMachineId}
            />
          )}

          {activeTab === 'system' && (
            <SystemPage
              appMode={appMode}
              isFirebaseActive={isFirebaseActive}
              totalMachines={allMachines.length}
              totalTelemetry={telemetry.length}
              lastSyncTime={lastSyncTime}
            />
          )}

          {/* Rodapé Obrigatório Padronizado */}
          <Footer />
        </main>
      </div>

      {/* Modal / Drawer 360° de Detalhes da Máquina */}
      {selectedMachine && (
        <MachineDetailModal
          machine={selectedMachine}
          quote={selectedQuote}
          insight={selectedInsight}
          telemetryHistory={telemetry}
          onClose={() => setSelectedMachineId(null)}
        />
      )}
    </div>
  );
};

export default App;
