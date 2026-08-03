import { ExploreApp } from "@/components/explore-app";
import { Hero } from "@/components/hero";
import { ListsSection } from "@/components/lists-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <ListsSection />
      <section id="explore">
        <ExploreApp />
      </section>
      <footer className="border-t border-[var(--line)] px-4 py-10 text-center text-xs text-[var(--ink-muted)]">
        Built for Karima&apos;s Japan trip · Places imported from Google Maps
      </footer>
    </main>
  );
}
