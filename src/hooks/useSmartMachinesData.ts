// SmartMachines — Hook Central de Dados e Filtros
import { useState, useEffect, useMemo } from 'react';
import { dataService, DataServiceState } from '../services/dataService';
import { Machine, FilterState } from '../types/machine';

export function useSmartMachinesData() {
  const [dataState, setDataState] = useState<DataServiceState>(dataService.getState());
  const [filters, setFilters] = useState<FilterState>({
    linha: 'ALL',
    turno: 'ALL',
    status: 'ALL',
    searchQuery: '',
  });
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = dataService.subscribe(newState => {
      setDataState(newState);
    });
    return unsubscribe;
  }, []);

  // Máquinas filtradas com memoização
  const filteredMachines = useMemo(() => {
    return dataState.machines.filter(m => {
      // Filtro por Linha
      if (filters.linha !== 'ALL' && m.linha_producao !== filters.linha) {
        return false;
      }
      // Filtro por Turno
      if (filters.turno !== 'ALL' && m.turno_operacao !== filters.turno) {
        return false;
      }
      // Filtro por Status
      if (filters.status !== 'ALL' && m.status_operacional !== filters.status) {
        return false;
      }
      // Busca textual por ID, Equipamento, Peça ou Componente
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchId = m.maquina_id.toLowerCase().includes(q);
        const matchEq = m.tipo_equipamento.toLowerCase().includes(q);
        const matchComp = m.componente_critico.toLowerCase().includes(q);
        const matchPart = m.codigo_peca_reposicao.toLowerCase().includes(q);
        if (!matchId && !matchEq && !matchComp && !matchPart) {
          return false;
        }
      }
      return true;
    });
  }, [dataState.machines, filters]);

  // Máquina atualmente selecionada para o modal de inspeção 360°
  const selectedMachine = useMemo<Machine | null>(() => {
    if (!selectedMachineId) return null;
    return dataState.machines.find(m => m.maquina_id === selectedMachineId) || null;
  }, [dataState.machines, selectedMachineId]);

  return {
    ...dataState,
    allMachines: dataState.machines,
    machines: filteredMachines,
    filters,
    setFilters,
    selectedMachine,
    setSelectedMachineId,
    reloadData: () => dataService.reloadData(),
  };
}
