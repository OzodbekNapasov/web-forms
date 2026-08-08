import React from "react";

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}
