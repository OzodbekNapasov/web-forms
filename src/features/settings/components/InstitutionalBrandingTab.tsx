"use client";

import React, { useState, useEffect } from "react";
import { SystemSettingsService, SystemBranding } from "../services/systemSettingsService";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Palette, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function InstitutionalBrandingTab() {
  const [branding, setBranding] = useState<SystemBranding>(SystemSettingsService.getBranding());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    SystemSettingsService.saveBranding(branding);
    toast.success("Institutional branding configurations updated!");
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card className="glass-card p-6 rounded-2xl space-y-4">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Building className="h-5 w-5 text-purple-600" /> Institutional Identity & Logo
        </CardTitle>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">University / Institution Name</label>
            <Input
              value={branding.institutionName}
              onChange={(e) => setBranding({ ...branding, institutionName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Palette className="h-3.5 w-3.5 text-blue-600" /> Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="h-8 w-10 rounded cursor-pointer border-none bg-transparent"
                />
                <Input
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="h-8 font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Palette className="h-3.5 w-3.5 text-emerald-600" /> Secondary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                  className="h-8 w-10 rounded cursor-pointer border-none bg-transparent"
                />
                <Input
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                  className="h-8 font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Palette className="h-3.5 w-3.5 text-purple-600" /> Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={branding.accentColor}
                  onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                  className="h-8 w-10 rounded cursor-pointer border-none bg-transparent"
                />
                <Input
                  value={branding.accentColor}
                  onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                  className="h-8 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="glass-card p-6 rounded-2xl space-y-4">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" /> Institutional Contact & Footer Metadata
        </CardTitle>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Contact Email</label>
              <Input
                value={branding.contactEmail}
                onChange={(e) => setBranding({ ...branding, contactEmail: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Contact Phone</label>
              <Input
                value={branding.contactPhone}
                onChange={(e) => setBranding({ ...branding, contactPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Physical Campus Address</label>
            <Input
              value={branding.address}
              onChange={(e) => setBranding({ ...branding, address: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Footer Copyright Text</label>
            <Input
              value={branding.footerText}
              onChange={(e) => setBranding({ ...branding, footerText: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
              Save Institutional Branding
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
}
