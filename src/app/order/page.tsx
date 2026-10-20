import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { pages } from "@/lib/content";
import styles from "./order.module.css";

const page = pages["st-order"];

export const metadata: Metadata = {
  title: page.t,
  description: page.m,
  alternates: { canonical: "/order/" },
  robots: { index: false, follow: false },
};

export default function OrderPage() {
  return (
    <main className={styles.main}>
      <p className={styles.eye}>Phase 2</p>
      <h1>{page.h1}</h1>
      <p className={styles.lead}>
        Ordering samples for parents is designed but not open yet. Brands can
        plan a START today.
      </p>
      <Button href="/plan/">Plan a START</Button>
    </main>
  );
}
