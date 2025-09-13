// Chart options and configuration
export const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true
      }
    },
    title: {
      display: false
    }
  }
};

export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false
      },
      ticks: {
        callback: function(value) {
          return '$' + value.toLocaleString();
        }
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
};

export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  elements: {
    line: {
      tension: 0.4
    },
    point: {
      radius: 4,
      hoverRadius: 6
    }
  }
};

export const chartColors = {
  pie: [
    'rgba(59, 130, 246, 0.8)', // blue
    'rgba(34, 197, 94, 0.8)',  // green
    'rgba(249, 115, 22, 0.8)', // orange
    'rgba(239, 68, 68, 0.8)'   // red
  ],
  pieHover: [
    'rgba(59, 130, 246, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(249, 115, 22, 1)',
    'rgba(239, 68, 68, 1)'
  ],
  bar: {
    background: 'rgba(99, 102, 241, 0.8)',
    hover: 'rgba(99, 102, 241, 1)'
  },
  line: {
    stroke: 'rgba(139, 92, 246, 1)',
    fill: 'rgba(139, 92, 246, 0.1)'
  }
};

// Status names for consistency
export const leadStatuses = ["New", "In Progress", "Converted", "Lost"];
