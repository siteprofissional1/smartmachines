import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { useTheme } from '../../hooks/useTheme';

interface PlotlyChartWrapperProps {
  data: any[];
  layout: any;
  config?: any;
  style?: React.CSSProperties;
  className?: string;
}

export const PlotlyChartWrapper: React.FC<PlotlyChartWrapperProps> = ({
  data,
  layout,
  config,
  style,
  className,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const defaultThemeLayout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: {
      family: 'Inter, sans-serif',
      color: isDark ? '#94A3B8' : '#475569',
      size: 11,
    },
    margin: { t: 30, r: 20, b: 40, l: 50 },
    autosize: true,
  };

  const mergedLayout = {
    ...defaultThemeLayout,
    ...layout,
    font: { ...defaultThemeLayout.font, ...(layout?.font || {}) },
  };

  const defaultConfig = {
    responsive: true,
    displayModeBar: false,
    ...config,
  };

  useEffect(() => {
    if (!chartRef.current) return;

    Plotly.newPlot(chartRef.current, data, mergedLayout, defaultConfig);

    const handleResize = () => {
      if (chartRef.current) {
        Plotly.Plots.resize(chartRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        Plotly.purge(chartRef.current);
      }
    };
  }, [data, layout, theme]);

  return (
    <div 
      ref={chartRef} 
      style={{ width: '100%', height: '100%', minHeight: '260px', ...style }} 
      className={className} 
    />
  );
};
