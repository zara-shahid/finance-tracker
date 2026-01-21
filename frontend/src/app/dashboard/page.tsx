'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { User, Transaction, Category } from '@/types';
import Layout from '@/components/Layout';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user || undefined}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <span className="text-xl">➕</span>
            <span className="font-medium">Add Transaction</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-800">Total Income</h3>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-green-700">
              {user?.currency} {totalIncome.toFixed(2)}
            </p>
            <p className="text-xs text-green-600 mt-2">
              {transactions.filter(t => categories.find(c => c.id === t.category)?.type === 'income').length} transactions
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-md border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-red-800">Total Expenses</h3>
              <span className="text-2xl">📉</span>
            </div>
            <p className="text-3xl font-bold text-red-700">
              {user?.currency} {totalExpense.toFixed(2)}
            </p>
            <p className="text-xs text-red-600 mt-2">
              {transactions.filter(t => categories.find(c => c.id === t.category)?.type === 'expense').length} transactions
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-800">Balance</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              {user?.currency} {balance.toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              {balance >= 0 ? 'You\'re in good shape!' : 'Consider reducing expenses'}
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <Link href="/transactions" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="p-6">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📊</span>
                <p className="text-gray-500 mb-4">No transactions yet</p>
                <Link
                  href="/transactions"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Your First Transaction
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => {
                  const category = categories.find(c => c.id === transaction.category);
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-md"
                          style={{ backgroundColor: category?.color || '#6B7280' }}
                        >
                          {category?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{category?.name}</p>
                          <p className="text-sm text-gray-500">
                            {transaction.description || 'No description'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            category?.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {category?.type === 'income' ? '+' : '-'}
                          {user?.currency} {transaction.amount}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{transaction.payment_method}</p>
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