'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Budget, Category, User, Transaction } from '@/types';
import Layout from '@/components/Layout';

export default function BudgetsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const [userRes, budgetsRes, categoriesRes, transactionsRes] = await Promise.all([
        api.get('/auth/profile/'),
        api.get('/budgets/'),
        api.get('/categories/'),
        api.get('/transactions/'),
      ]);

      setUser(userRes.data);
      setBudgets(budgetsRes.data.results || budgetsRes.data);
      setCategories(categoriesRes.data.results || categoriesRes.data);
      setTransactions(transactionsRes.data.results || transactionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/budgets/', formData);
      setFormData({
        category: '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      setShowAddForm(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create budget');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      await api.delete(`/budgets/${id}/`);
      fetchData();
    } catch (err) {
      alert('Failed to delete budget');
    }
  };

  const getSpentAmount = (categoryId: number, month: number, year: number) => {
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          t.category === categoryId &&
          transactionDate.getMonth() + 1 === month &&
          transactionDate.getFullYear() === year
        );
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <Layout user={user || undefined}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading budgets...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <Layout user={user || undefined}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
            <p className="text-gray-600 mt-1">Set spending limits and track your progress</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span className="text-xl">{showAddForm ? '✕' : '➕'}</span>
            <span className="font-medium">{showAddForm ? 'Cancel' : 'Add Budget'}</span>
          </button>
        </div>

        {/* Add Budget Form */}
        {showAddForm && (
          <div className="mb-8 bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Budget</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {expenseCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ({user?.currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month *
                  </label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Budget
              </button>
            </form>
          </div>
        )}

        {/* Budgets List */}
        {budgets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
            <span className="text-6xl mb-4 block">💰</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No budgets yet</h3>
            <p className="text-gray-600 mb-6">Start tracking your spending by creating a budget</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {budgets.map((budget) => {
              const category = categories.find(c => c.id === budget.category);
              const spent = getSpentAmount(budget.category, budget.month, budget.year);
              const budgetAmount = parseFloat(budget.amount);
              const percentage = (spent / budgetAmount) * 100;
              const isOverBudget = spent > budgetAmount;

              return (
                <div key={budget.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                        style={{ backgroundColor: category?.color || '#6B7280' }}
                      >
                        {category?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category?.name}</h3>
                        <p className="text-sm text-gray-500">
                          {months[budget.month - 1]} {budget.year}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete budget"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spent</span>
                      <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                        {user?.currency} {spent.toFixed(2)} / {budgetAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          isOverBudget
                            ? 'bg-red-500'
                            : percentage > 80
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {percentage.toFixed(0)}% used
                      </span>
                      {isOverBudget ? (
                        <span className="text-xs text-red-600 font-medium">
                          ⚠️ Over budget by {user?.currency} {(spent - budgetAmount).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-xs text-green-600 font-medium">
                          {user?.currency} {(budgetAmount - spent).toFixed(2)} remaining
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}