import { motion } from 'framer-motion';

export const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />
);

export const KPICardSkeleton = () => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="p-4 animate-pulse flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center space-x-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <Skeleton className="h-4 w-32 mb-6" />
    <Skeleton className="w-full h-64" />
  </div>
);

const SkeletonLoader = () => (
  <div className="space-y-6">
    {/* KPI Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <KPICardSkeleton />
        </motion.div>
      ))}
    </div>

    {/* Charts Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
        >
          <ChartSkeleton />
        </motion.div>
      ))}
    </div>

    {/* Table Loading */}
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {[...Array(5)].map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </motion.div>
  </div>
);

export default SkeletonLoader;
