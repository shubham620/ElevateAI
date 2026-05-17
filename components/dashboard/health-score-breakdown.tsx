// components/dashboard/health-score-breakdown.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Zap, Target, BarChart3, TrendingUp, Clock } from "lucide-react";

interface HealthScoreBreakdownProps {
  score: number;
  consistency?: number;
  completion?: number;
  engagement?: number;
  productivity?: number;
  deadlineDiscipline?: number;
}

export function HealthScoreBreakdown({
  score = 75,
  consistency = 72,
  completion = 78,
  engagement = 75,
  productivity = 80,
  deadlineDiscipline = 68,
}: HealthScoreBreakdownProps) {
  const metrics = [
    { label: "Consistency", value: consistency, icon: Zap, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "Completion", value: completion, icon: Target, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "Engagement", value: engagement, icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-100" },
    { label: "Productivity", value: productivity, icon: BarChart3, color: "text-orange-600", bgColor: "bg-orange-100" },
    { label: "Deadline Discipline", value: deadlineDiscipline, icon: Clock, color: "text-red-600", bgColor: "bg-red-100" },
  ];

  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (value: number) => {
    if (value >= 80) return "bg-green-100 border-green-300";
    if (value >= 60) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            Work Health Score
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="flex items-center justify-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`relative h-40 w-40 rounded-full border-8 ${getScoreBgColor(score)} flex items-center justify-center`}
            >
              <div className="text-center">
                <p className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</p>
                <p className="text-sm text-gray-600 mt-1">/ 100</p>
              </div>
            </motion.div>
          </div>

          {/* Score Interpretation */}
          <div className={`p-3 rounded-lg text-center text-sm font-semibold ${
            score >= 80
              ? "bg-green-50 text-green-800"
              : score >= 60
              ? "bg-yellow-50 text-yellow-800"
              : "bg-red-50 text-red-800"
          }`}>
            {score >= 80
              ? "Excellent performance - Keep up the great work!"
              : score >= 60
              ? "Good performance - Focus on the metrics below to improve"
              : "Needs attention - Work on improving your consistency and deadlines"}
          </div>

          {/* Metric Breakdown */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">Performance Breakdown</p>
            {metrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800">{metric.label}</p>
                      <p className={`text-sm font-bold ${getScoreColor(metric.value)}`}>{metric.value}</p>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ delay: 0.3 + idx * 0.05, duration: 0.8 }}
                        className={`h-full rounded-full ${
                          metric.value >= 80
                            ? "bg-green-500"
                            : metric.value >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Improvement Tips */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 mb-2">💡 Tips to Improve Your Health Score</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Submit regular updates on your goals</li>
              <li>• Meet deadlines consistently</li>
              <li>• Engage with feedback from your manager</li>
              <li>• Maintain steady progress on all goals</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
