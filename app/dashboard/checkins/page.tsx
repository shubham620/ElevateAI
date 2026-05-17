// app/dashboard/checkins/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, TrendingUp, Plus } from "lucide-react";
import { apiGet } from "@/lib/api";
import { CheckinCreateDialog } from "@/components/checkins/checkin-create-dialog";
import { CheckinReviewPanel } from "@/components/checkins/checkin-review-panel";
import { Goal } from "@/types";

interface Checkin {
  id: string;
  goalId: string;
  quarter: string;
  achievement: string;
  progress: number;
  status: string;
  managerComment?: string;
  createdAt: Date;
  goal: Goal;
  user: {
    name: string;
    email: string;
  };
}

const quarters = ["Q1", "Q2", "Q3", "Q4"];
const currentQuarter = "Q2"; // You can make this dynamic

export default function CheckinsPage() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState(currentQuarter);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const goalsData = await apiGet("/api/goals");
      setGoals(goalsData);

      const checkinsData = await apiGet("/api/checkins");
      setCheckins(checkinsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCheckin = async () => {
    loadData();
    setDialogOpen(false);
  };

  const getCheckinForGoalAndQuarter = (goalId: string, quarter: string) => {
    return checkins.find((c) => c.goalId === goalId && c.quarter === quarter);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "ON_TRACK":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case "AT_RISK":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "ON_TRACK":
        return "bg-blue-100 text-blue-800";
      case "AT_RISK":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Quarterly Check-ins</h1>
        <p className="text-muted-foreground mt-2">
          {userRole === "MANAGER"
            ? "Review your team's quarterly progress and provide feedback"
            : "Update your progress on goals each quarter"}
        </p>
      </motion.div>

      {userRole === "EMPLOYEE" ? (
        <>
          {/* Employee Check-in View */}
          <div className="grid gap-6">
            {/* Quarter Selection */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {quarters.map((q) => (
                <Button
                  key={q}
                  variant={selectedQuarter === q ? "default" : "outline"}
                  onClick={() => setSelectedQuarter(q)}
                >
                  {q}
                </Button>
              ))}
            </div>

            {/* Goals for Check-in */}
            <div className="space-y-4">
              {goals.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">No goals created yet</p>
                  </CardContent>
                </Card>
              ) : (
                goals.map((goal, idx) => {
                  const checkin = getCheckinForGoalAndQuarter(goal.id, selectedQuarter);

                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{goal.title}</CardTitle>
                              <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                            </div>
                            {checkin && (
                              <Badge className={getStatusColor(checkin.status)}>
                                {checkin.status}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent>
                          {checkin ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-600">Progress</p>
                                  <p className="text-2xl font-bold text-blue-600">{checkin.progress}%</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">Target</p>
                                  <p className="text-sm text-gray-900">
                                    {goal.target} {goal.kpiType}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Your Achievement</p>
                                <p className="text-sm text-gray-800">{checkin.achievement}</p>
                              </div>

                              {checkin.managerComment && (
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                  <p className="text-xs text-blue-700 font-semibold mb-1">Manager Feedback</p>
                                  <p className="text-sm text-blue-900">{checkin.managerComment}</p>
                                </div>
                              )}

                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedGoal(goal);
                                  setDialogOpen(true);
                                }}
                                className="w-full"
                              >
                                Edit Check-in
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-600 mb-3">No check-in submitted yet</p>
                              <Button
                                onClick={() => {
                                  setSelectedGoal(goal);
                                  setDialogOpen(true);
                                }}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Submit Check-in
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Create Checkin Dialog */}
          {selectedGoal && (
            <CheckinCreateDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              goal={selectedGoal}
              quarter={selectedQuarter}
              onSuccess={handleCreateCheckin}
            />
          )}
        </>
      ) : (
        <>
          {/* Manager Review View */}
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {checkins.filter((c) => !c.managerComment).length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <CheckCircle2 className="w-12 h-12 mx-auto text-green-400 mb-2" />
                    <p className="text-gray-600">All check-ins have been reviewed</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {checkins
                    .filter((c) => !c.managerComment)
                    .map((checkin, idx) => (
                      <motion.div
                        key={checkin.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <CheckinReviewPanel
                          checkin={checkin}
                          onReviewComplete={loadData}
                        />
                      </motion.div>
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviewed" className="space-y-4">
              {checkins.filter((c) => c.managerComment).length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">No reviewed check-ins yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {checkins
                    .filter((c) => c.managerComment)
                    .map((checkin, idx) => (
                      <motion.div
                        key={checkin.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{checkin.goal.title}</CardTitle>
                                <p className="text-sm text-gray-600 mt-1">By {checkin.user.name}</p>
                              </div>
                              <Badge className={getStatusColor(checkin.status)}>
                                {checkin.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-gray-600 font-semibold mb-1">Achievement</p>
                                <p className="text-sm text-gray-800">{checkin.achievement}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 font-semibold mb-1">Your Feedback</p>
                                <p className="text-sm text-gray-800">{checkin.managerComment}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
