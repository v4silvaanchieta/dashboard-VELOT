"use client";

import Header from "./Header";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
