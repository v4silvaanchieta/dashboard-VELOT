"use client";

import CampanhaKpis from "./CampanhaKpis";
import SourceBarChart from "./SourceBarChart";
import CampaignTable from "./CampaignTable";
import CreativeQualityTable from "./CreativeQualityTable";

export default function CampanhaTab() {
  return (
    <div>
      <CampanhaKpis />
      <div className="mb-6">
        <SourceBarChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CampaignTable />
        <CreativeQualityTable />
      </div>
    </div>
  );
}
