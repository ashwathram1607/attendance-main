import { motion, AnimatePresence } from "framer-motion";

export default function CheckOutDialog({ workedTime, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/90 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-200"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Confirm Check-Out
          </h2>
          <p className="text-gray-600 mb-6">
            You’ve worked for{" "}
            <span className="font-semibold text-[#0b2c5d]">{workedTime}</span>.
            Are you sure you want to check out?
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onConfirm}
              className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 shadow-md transition-all"
            >
              Yes, Check Out
            </button>
            <button
              onClick={onCancel}
              className="px-5 py-2 rounded-lg bg-gray-300 text-gray-800 font-medium hover:bg-gray-400 shadow-md transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
