import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle2, Users, TrendingUp } from "lucide-react";

interface KpiGridProps {
  totalSurveys: number;
  publishedSurveys: number;
  totalResponses: number;
}

export default function KpiGrid({ totalSurveys, publishedSurveys, totalResponses }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="glass-card hover:border-blue-500/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Surveys
          </CardTitle>
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalSurveys}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Created forms in database</p>
        </CardContent>
      </Card>

      <Card className="glass-card hover:border-emerald-500/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Published
          </CardTitle>
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{publishedSurveys}</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Accepting student entries</p>
        </CardContent>
      </Card>

      <Card className="glass-card hover:border-purple-500/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Submissions
          </CardTitle>
          <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalResponses}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Responses submitted by students</p>
        </CardContent>
      </Card>

      <Card className="glass-card hover:border-amber-500/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Avg Completion Rate
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">94.8%</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">High student response engagement</p>
        </CardContent>
      </Card>
    </div>
  );
}
