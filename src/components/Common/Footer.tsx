// SmartMachines — Rodapé Obrigatório Padronizado
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer 
      id="smartmachines-footer"
      style={{
        width: '100%',
        textAlign: 'center',
        padding: '1.5rem 1rem',
        marginTop: '3rem',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
      }}
    >
      desenvolvido por{' '}
      <a 
        href="https://siteprofissional.pro" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          color: '#3B82F6',
          textDecoration: 'underline',
          fontWeight: 600,
        }}
      >
        siteprofissional
      </a>
    </footer>
  );
};
