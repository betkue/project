/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import { useFleetEfficiency, useFleetComposition, useFleetOperational } from '../hooks/useAnalytics';
import { motion } from 'framer-motion';
import Loader from '@/components/Loader';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const { data: efficiencyData, loading: loadingEfficiency } = useFleetEfficiency();
  const { data: compositionData, loading: loadingComposition } = useFleetComposition();
  const { data: operationalData, loading: loadingOperational } = useFleetOperational();





  if (loadingEfficiency || loadingComposition || loadingOperational ) {
    return <Loader/>;
  }

  const avgEnergy = efficiencyData?.avgConsumption?.avgEnergy ?? 0;
  const emissions = efficiencyData?.emissionsComparison ?? [];
  const composition = compositionData ?? [];
  const operational = operationalData ?? {};

  const parsedCountInComposition = composition.map((item: any) => ({
    ...item,
    count: Number(item.count),
  }));

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  return (
    
      <section>

        <h1 className="text-3xl font-bold mb-10 mt-10 text-center">Fleet Analytics Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center items-center text-center max-w-7xl mx-auto">

          <motion.div
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <h2 className="text-xl font-semibold mb-3">Fleet Efficiency</h2>
            <p className="mb-3 text-center text-gray-600">
              Overview of average energy consumption (kWh/100km) and CO2 emissions per vehicle type.
            </p>
            <p className="mb-6 font-medium">
              Average Consumption: <span className="text-indigo-600">{avgEnergy.toFixed(2)} kWh/100km</span>
            </p>

            <LineChart
              width={300}
              height={200}
              data={emissions}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgEmissions" stroke="#8884d8" />
            </LineChart>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <h2 className="text-xl font-semibold mb-3">Fleet Composition</h2>
            <p className="mb-3 text-center text-gray-600">
              Distribution of your fleet by vehicle type, showing how your assets are allocated.
            </p>

            {parsedCountInComposition.length > 0 ? (
              <>
                <PieChart width={300} height={200}>
                  <Pie
                    data={parsedCountInComposition}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    isAnimationActive={false}
                    outerRadius={80}
                    label={({ name, percent }: any) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {parsedCountInComposition.map((_entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>

                <ul className="mt-4 w-full text-left text-gray-700">
                  {parsedCountInComposition.map((entry: any, index: number) => (
                    <li key={index} className="flex items-center mb-1">
                      <span
                        className="inline-block w-4 h-4 mr-3 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{entry.type}: {entry.count}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>No data available.</p>
            )}
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <h2 className="text-xl font-semibold mb-3">Fleet Operational Status</h2>
            <p className="mb-6 text-center text-gray-600">
              Track your fleet’s operational status: availability, charging state, and usage levels.
            </p>

            <BarChart
              width={300}
              height={200}
              data={[
                { name: 'Available', value: operational.availabilityRate ?? 0 },
                { name: 'Charging', value: operational.charging ?? 0 },
                { name: 'In Use', value: operational.inUse ?? 0 },
              ]}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </motion.div>

        </div>
      </section>
   
  );
}
