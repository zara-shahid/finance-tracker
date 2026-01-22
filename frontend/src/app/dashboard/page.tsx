'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { User, Transaction, Category } from '@/types';
import Layout from '@/components/Layout';
import Charts from '@/components/Charts';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const [userRes, transactionsRes, categoriesRes] = await Promise.all([
          api.get('/auth/profile/'),
          api.get('/transactions/'),
          api.get('/categories/'),
        ]);

        setUser(userRes.data);
        setTransactions(transactionsRes.data.results || transactionsRes.data);
        setCategories(categoriesRes.data.results || categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const totalIncome = transactions
    .filter(t => {
      const cat = categories.find(c => c.id === t.category);
      return cat?.type === 'income';
    })
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => {
      const cat = categories.find(c => c.id === t.category);
      return cat?.type === 'expense';
    })
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user || undefined}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Welcome back, <span className="font-semibold text-gray-900">{user?.username}</span>! 👋</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Link
            href="/transactions"
            className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="text-2xl relative z-10 group-hover:rotate-12 transition-transform">➕</span>
            <span className="font-semibold text-lg relative z-10">Add Transaction</span>
            <span className="ml-2 text-sm opacity-75 relative z-10">→</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Income Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-white p-6 rounded-2xl shadow-xl card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                  +{((totalIncome / (totalIncome + totalExpense || 1)) * 100).toFixed(0)}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Income</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {user?.currency} {totalIncome.toFixed(2)}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {transactions.filter(t => categories.find(c => c.id === t.category)?.type === 'income').length} transactions
              </div>
            </div>
          </div>

          {/* Expense Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-white p-6 rounded-2xl shadow-xl card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl shadow-lg">
                  <span className="text-2xl">📉</span>
                </div>
                <div className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                  {((totalExpense / (totalIncome + totalExpense || 1)) * 100).toFixed(0)}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Expenses</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {user?.currency} {totalExpense.toFixed(2)}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {transactions.filter(t => categories.find(c => c.id === t.category)?.type === 'expense').length} transactions
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="relative group">
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${balance >= 0 ? 'from-blue-400 to-cyan-500' : 'from-orange-400 to-red-500'} rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-300`} />
            <div className="relative bg-white p-6 rounded-2xl shadow-xl card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${balance >= 0 ? 'from-blue-400 to-cyan-500' : 'from-orange-400 to-red-500'} rounded-xl shadow-lg`}>
                  <span className="text-2xl">{balance >= 0 ? '💰' : '⚠️'}</span>
                </div>
                <div className={`px-3 py-1 ${balance >= 0 ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'} text-xs font-semibold rounded-full`}>
                  {balance >= 0 ? 'Positive' : 'Deficit'}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Current Balance</h3>
              <p className={`text-3xl font-bold mb-2 ${balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                {user?.currency} {Math.abs(balance).toFixed(2)}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`w-2 h-2 ${balance >= 0 ? 'bg-blue-500' : 'bg-orange-500'} rounded-full animate-pulse`} />
                {balance >= 0 ? 'Healthy finances' : 'Needs attention'}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        {transactions.length > 0 && (
          <Charts 
            transactions={transactions} 
            categories={categories} 
            currency={user?.currency || 'USD'} 
          />
        )}

        {/* Recent Transactions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
              <p className="text-sm text-gray-500 mt-0.5">Your latest financial activities</p>
            </div>
            <Link 
              href="/transactions" 
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              View All
              <span>→</span>
            </Link>
          </div>
          <div className="p-6">
            {transactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-500 mb-6">Start tracking your finances by adding your first transaction</p>
                <Link
                  href="/transactions"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  <span className="text-xl">➕</span>
                  <span className="font-medium">Add Your First Transaction</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => {
                  const category = categories.find(c => c.id === transaction.category);
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all card-hover border border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                          style={{ backgroundColor: category?.color || '#6B7280' }}
                        >
                          {category?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{category?.name}</p>
                          <p className="text-sm text-gray-500">
                            {transaction.description || 'No description'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <span>📅</span>
                            {new Date(transaction.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-xl font-bold ${
                            category?.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {category?.type === 'income' ? '+' : '-'}
                          {user?.currency} {transaction.amount}
                        </p>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <span className="text-xs text-gray-500">
                            {transaction.payment_method === 'cash' && '💵'}
                            {transaction.payment_method === 'card' && '💳'}
                            {transaction.payment_method === 'bank_transfer' && '🏦'}
                            {transaction.payment_method === 'upi' && '📱'}
                            {transaction.payment_method === 'other' && '🔄'}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {transaction.payment_method.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}