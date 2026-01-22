'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction, Category } from '@/types';

interface ChartsProps {
  transactions: Transaction[];
  categories: Category[];
  currency: string;
}

export default function Charts({ transactions, categories, currency }: ChartsProps) {
  // Prepare data for category spending pie chart
  const categoryData = categories
    .filter(cat => cat.type === 'expense')
    .map(cat => {
      const total = transactions
        .filter(t => t.category === cat.id)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      return {
        name: cat.name,
        value: total,
        color: cat.color,
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  // Prepare data for income vs expense bar chart
  const incomeVsExpenseData = [
    {
      name: 'Income',
      amount: transactions
        .filter(t => {
          const cat = categories.find(c => c.id === t.category);
          return cat?.type === 'income';
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0),
      fill: '#10B981',
    },
    {
      name: 'Expenses',
      amount: transactions
        .filter(t => {
          const cat = categories.find(c => c.id === t.category);
          return cat?.type === 'expense';
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0),
      fill: '#EF4444',
    },
  ];

  // Prepare monthly trend data (last 12 months)
  const monthlyData = Array.from({ length: 12}, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const monthNum = date.getMonth() + 1;

    const income = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        const cat = categories.find(c => c.id === t.category);
        return (
          cat?.type === 'income' &&
          tDate.getMonth() + 1 === monthNum &&
          tDate.getFullYear() === year
        );
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expense = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        const cat = categories.find(c => c.id === t.category);
        return (
          cat?.type === 'expense' &&
          tDate.getMonth() + 1 === monthNum &&
          tDate.getFullYear() === year
        );
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      month,
      income,
      expense,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {currency} {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Category Spending Pie Chart */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
        {categoryData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>No expense data to display</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
        <div className="mt-4 space-y-2">
          {categoryData.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">{item.name}</span>
              </div>
              <span className="font-medium text-gray-900">
                {currency} {item.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Income vs Expense Comparison */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses</h3>
        {incomeVsExpenseData.every(item => item.amount === 0) ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>No transaction data to display</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeVsExpenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {incomeVsExpenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-xl font-bold text-green-600">
              {currency} {incomeVsExpenseData[0].amount.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-xl font-bold text-red-600">
              {currency} {incomeVsExpenseData[1].amount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Trend - Full Width */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">12-Month Trend</h3>
        {monthlyData.every(m => m.income === 0 && m.expense === 0) ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>No historical data to display</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" fill="#10B981" radius={[8, 8, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#EF4444" radius={[8, 8, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}