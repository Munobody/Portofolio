import { PortfolioData } from "@/types/portfolio";
import defaultDataRaw from "../data/portfolio.json";

export const defaultPortfolioData = defaultDataRaw as unknown as PortfolioData;

export function loadPortfolioData(): PortfolioData {
  if (typeof window === "undefined") return defaultPortfolioData;
  const saved = localStorage.getItem("portfolio_data");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...defaultPortfolioData,
        ...parsed,
        navbar: { ...defaultPortfolioData.navbar, ...parsed.navbar },
        hero: { ...defaultPortfolioData.hero, ...parsed.hero },
        about: { ...defaultPortfolioData.about, ...parsed.about },
        activities: { ...defaultPortfolioData.activities, ...parsed.activities },
        cta: { ...defaultPortfolioData.cta, ...parsed.cta },
        footer: { ...defaultPortfolioData.footer, ...parsed.footer },
        aboutPage: { ...defaultPortfolioData.aboutPage, ...parsed.aboutPage },
        activitiesPage: { ...defaultPortfolioData.activitiesPage, ...parsed.activitiesPage },
        contactPage: { ...defaultPortfolioData.contactPage, ...parsed.contactPage },
      };
    } catch (e) {
      console.error("Failed to parse saved local portfolio cache", e);
    }
  }
  return defaultPortfolioData;
}

export function savePortfolioData(data: PortfolioData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_data", JSON.stringify(data));
  }
}
