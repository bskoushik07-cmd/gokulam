import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOutletMenu, allOutletMenus } from "@/content/menu";
import OutletMenuClient from "./OutletMenuClient";

type PageProps = {
  params: Promise<{ outlet: string }>;
};

export function generateStaticParams() {
  return [
    { outlet: "janpath" },
    { outlet: "sector-62" },
    { outlet: "delhi-janpath" },
    { outlet: "noida-sector-62" },
  ];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { outlet: outletParam } = await params;
  const menuInfo = getOutletMenu(outletParam);

  if (!menuInfo) {
    return { title: "Menu — Gokulam" };
  }

  return {
    title: `${menuInfo.name} Menu — Authentic South Indian Food`,
    description: `Explore the authentic South Indian menu at ${menuInfo.name} in ${menuInfo.location}. Benne dosas, Thatte idlis, Bangalore thali, filter coffee and more.`,
  };
}

export default async function OutletMenuPage({ params }: PageProps) {
  const { outlet: outletParam } = await params;
  const menuInfo = getOutletMenu(outletParam);

  if (!menuInfo) {
    notFound();
  }

  return <OutletMenuClient menuInfo={menuInfo} outletParam={outletParam} />;
}
