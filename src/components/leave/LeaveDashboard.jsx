import { ROUTES } from "../../constants/routes";
import { motion } from "framer-motion";

export default function LeaveDashboard({ setActivePage }) {
  const boxes = [
    {
      title: "Leave Request Form",
      desc: "Submit a new leave request.",
      color: "from-blue-500 to-indigo-500",
      route: ROUTES.LEAVEREQUESTFORM,
    },
    {
      title: "Balance Check",
      desc: "Check your remaining leave balance.",
      color: "from-green-500 to-emerald-500",
      route: ROUTES.BALANCECHECK,
    },
    {
      title: "Approved Leaves",
      desc: "View all your approved leaves.",
      color: "from-purple-500 to-pink-500",
      route: ROUTES.APPROVED,
    },
  ];

  // Framer Motion card variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute top-10 left-10 w-56 h-56 bg-blue-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-10 drop-shadow-md">
        Leave Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-5xl z-10">
        {boxes.map((box, i) => (
          <motion.div
            key={box.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              rotate: 1,
              boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
            }}
            onClick={() => setActivePage(box.route)}
            className={`bg-gradient-to-br ${box.color} text-white rounded-2xl shadow-lg p-10 text-center cursor-pointer transition-transform duration-300`}
          >
            <h2 className="text-2xl font-semibold mb-3">{box.title}</h2>
            <p className="text-white/90 text-sm">{box.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
