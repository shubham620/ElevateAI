// components/analytics/charts.tsx
"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface AnalyticsChartsProps {
  data?: {
    productivity?: any[];
    completion?: any[];
    riskDistribution?: any[];
    departmentComparison?: any[];
    healthScoreTrend?: any[];
  };
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function Analytics({ data = {} }: AnalyticsChartsProps) {
  // Default data
  const productivityData = data.productivity || generateProductivityData();
  const completionData = data.completion || generateCompletionData();
  const riskData = data.riskDistribution || generateRiskData();
  const departmentData = data.departmentComparison || generateDepartmentData();
  const trendData = data.healthScoreTrend || generateTrendData();

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Performance metrics, trends, and organizational insights
        </p>
      </motion.div>

      {/* Grid Layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Productivity Trends */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Productivity Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#10b981"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Completion Rate by Quarter
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="inProgress" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                <Bar dataKey="notStarted" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Risk Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Department Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Department Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={departmentData}
                layout="vertical"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="avgCompletion" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Health Score Trend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Health Score Trend (30 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Key Metrics</h2>
          <div className="grid gap-4 md:grid-cols-5">
            <MetricBox label="Avg Completion" value="72%" trend="↗ 5%" />
            <MetricBox label="On-Time Delivery" value="84%" trend="↗ 2%" />
            <MetricBox label="Risk Goals" value="12" trend="↘ 3" />
            <MetricBox label="Team Health" value="78/100" trend="→ stable" />
            <MetricBox label="Active Goals" value="238" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// Metric Box Component
function MetricBox({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-transparent p-4">
      <p className="text-xs font-semibold text-gray-600">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {trend && <p className="mt-1 text-xs text-gray-600">{trend}</p>}
    </div>
  );
}

// Generate sample data functions
function generateProductivityData() {
  return [
    { week: "Week 1", productivity: 65, target: 75 },
    { week: "Week 2", productivity: 72, target: 75 },
    { week: "Week 3", productivity: 78, target: 75 },
    { week: "Week 4", productivity: 82, target: 75 },
    { week: "Week 5", productivity: 80, target: 75 },
  ];
}

function generateCompletionData() {
  return [
    { quarter: "Q1", completed: 45, inProgress: 30, notStarted: 25 },
    { quarter: "Q2", completed: 52, inProgress: 28, notStarted: 20 },
    { quarter: "Q3", completed: 58, inProgress: 25, notStarted: 17 },
    { quarter: "Q4", completed: 65, inProgress: 22, notStarted: 13 },
  ];
}

function generateRiskData() {
  return [
    { name: "Low Risk", value: 45 },
    { name: "Medium Risk", value: 35 },
    { name: "High Risk", value: 20 },
  ];
}

function generateDepartmentData() {
  return [
    { name: "Engineering", avgCompletion: 78 },
    { name: "Sales", avgCompletion: 82 },
    { name: "Marketing", avgCompletion: 75 },
    { name: "HR", avgCompletion: 88 },
    { name: "Finance", avgCompletion: 85 },
  ];
}

function generateTrendData() {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: Math.floor(Math.random() * 30 + 60),
    });
  }
  return data;
}
