export const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'contacted':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'converted':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'lost':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

export const EmptyState = ({ title, message, icon: Icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-600">
        <Icon size={64} />
      </div>
      <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        {message}
      </p>
      {action}
    </div>
  );
};

export const StripedTable = ({ children, className = '' }) => {
  return (
    <div className={`overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </table>
    </div>
  );
};

export const StripedRow = ({ children, isEven }) => {
  return (
    <tr className={`
      ${isEven ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}
      hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors
    `}>
      {children}
    </tr>
  );
};
