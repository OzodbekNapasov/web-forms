"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, RotateCcw } from "lucide-react";

interface ResponseFiltersToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  groupFilter: string;
  setGroupFilter: (group: string) => void;
  genderFilter: string;
  setGenderFilter: (gender: string) => void;
  courseFilter: string;
  setCourseFilter: (course: string) => void;
  onReset: () => void;
}

export default function ResponseFiltersToolbar({
  searchQuery,
  setSearchQuery,
  groupFilter,
  setGroupFilter,
  genderFilter,
  setGenderFilter,
  courseFilter,
  setCourseFilter,
  onReset,
}: ResponseFiltersToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-card p-4 rounded-2xl">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search responses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <Filter className="h-3.5 w-3.5 text-slate-400 ml-1" />

          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="h-7 text-xs border-none bg-transparent w-28">
              <SelectValue placeholder="Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="CS-201">CS-201</SelectItem>
              <SelectItem value="SE-302">SE-302</SelectItem>
              <SelectItem value="AI-401">AI-401</SelectItem>
            </SelectContent>
          </Select>

          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="h-7 text-xs border-none bg-transparent w-28">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>

          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="h-7 text-xs border-none bg-transparent w-36">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Software Engineering">Software Engineering</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-xs gap-1 text-slate-500">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
