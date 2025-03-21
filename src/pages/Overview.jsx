import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import service from '../appwrite/conf';
import { useParams } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Overview = () => {
  const [expenses, setExpenses] = useState([]);
  const { user_id } = useParams();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await service.readAll(user_id);
        console.log(response);
        if (response && response.documents) {
          setExpenses(response.documents);
        } else {
          console.error("Invalid response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, [user_id]);

  // Prepare labels and dataset values.
  const labels = expenses.map(exp => exp.title);
  const expenseLimitData = expenses.map(item => item.expenselimit);
  const expenditureData = expenses.map(item => item.expenditure);

  // Calculate totals (if needed elsewhere)
  const totalExpenseLimit = expenses.reduce((sum, exp) => sum + (exp.expenselimit || 0), 0);
  const totalExpenditure = expenses.reduce((sum, exp) => sum + (exp.expenditure || 0), 0);

  // Setup data for a grouped bar chart (not stacked)
  const data = {
    labels,
    datasets: [
      {
        label: 'Expense Limit',
        data: expenseLimitData,
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Light blue
      },
      {
        label: 'Expenditure',
        data: expenditureData,
        backgroundColor: 'rgba(255, 99, 132, 0.8)', // Darker red
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows container height to control chart height
    plugins: {
      title: {
        display: true,
        text: 'Grouped Bar Chart: Expense Limit vs Expenditure',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        stacked: false, // Disable stacking so bars are grouped side by side
      },
      y: {
        beginAtZero: true,
        stacked: false,
      },
    },
    barPercentage: 0.5, // Adjusts bar width (feel free to tweak this)
  };

return (
  <div className="min-h-screen bg-gradient-to-r from-[#e7f0e4] to-[#cde7d6] flex flex-col items-center p-6">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
      <div className="card bg-white shadow-md p-6 rounded-lg">
        <h3 className="text-xl font-semibold">Total Expense Limit</h3>
        <p className="text-2xl font-bold">₹{totalExpenseLimit}</p>
      </div>
      <div className="card bg-white shadow-md p-6 rounded-lg">
        <h3 className="text-xl font-semibold">Total Expenditure</h3>
        <p className="text-2xl font-bold">₹{totalExpenditure}</p>
      </div>
    </div>

    <div className="w-full max-w-6xl bg-white shadow-md p-6 rounded-lg mt-6">
      <h2 className="text-2xl font-semibold text-gray-900">Expense Breakdown</h2>
      <div className="h-96">
        <Bar data={data} options={options} />
      </div>
    </div>
  </div>
);
}

export default Overview;
