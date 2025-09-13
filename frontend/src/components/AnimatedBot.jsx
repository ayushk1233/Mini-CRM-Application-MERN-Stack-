import { motion } from 'framer-motion';

const AnimatedBot = () => {
  return (
    <motion.div
      className="absolute -top-20 -right-16 w-72 h-72"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 shadow-lg shadow-indigo-300/50"
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg 
          className="absolute inset-0 w-full h-full text-white p-8"
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antenna */}
          <motion.path
            d="M12 4L12 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          />
          
          {/* Head */}
          <motion.rect
            x="6"
            y="6"
            width="12"
            height="10"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          
          {/* Eyes */}
          <motion.circle
            cx="9"
            cy="10"
            r="1.5"
            fill="currentColor"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="15"
            cy="10"
            r="1.5"
            fill="currentColor"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          />
          
          {/* Smile */}
          <motion.path
            d="M9 13.5C9 13.5 10.5 14.5 12 14.5C13.5 14.5 15 13.5 15 13.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </svg>
      </motion.div>
      
      {/* Shadow */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black/10 rounded-full blur-md"
        animate={{
          width: ["5rem", "4rem", "5rem"],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default AnimatedBot;
