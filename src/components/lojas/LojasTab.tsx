"use client";

import LojasKpis from "./LojasKpis";
import SalesFunnel from "./SalesFunnel";
import SpeedToLead from "./SpeedToLead";
import StoreRanking from "./StoreRanking";

export default function LojasTab() {
  return (
    <div>
      <LojasKpis />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <SalesFunnel />
        </div>
        <SpeedToLead />
      </div>
      <StoreRanking />
    </div>
  );
}
