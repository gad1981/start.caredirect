"use client";

import Image from "next/image";
import {
  createContext,
  use,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import styles from "./order.module.css";

export type OrderStageOption = {
  id: string;
  name: string;
  kitSrc: string;
};

type OrderSampleContextValue = {
  stages: OrderStageOption[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  selected: OrderStageOption;
};

const OrderSampleContext = createContext<OrderSampleContextValue | null>(null);

function useOrderSample() {
  const ctx = use(OrderSampleContext);
  if (!ctx) {
    throw new Error("OrderSample components need OrderSampleProvider");
  }
  return ctx;
}

export function OrderSampleProvider({
  stages,
  children,
}: {
  stages: OrderStageOption[];
  children: ReactNode;
}) {
  const initial = stages[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState(initial);
  const selected = useMemo(
    () => stages.find((s) => s.id === selectedId) ?? stages[0],
    [stages, selectedId],
  );

  const value = useMemo(
    () => ({
      stages,
      selectedId: selected?.id ?? selectedId,
      setSelectedId,
      selected: selected ?? stages[0],
    }),
    [stages, selectedId, selected],
  );

  if (!stages.length || !value.selected) return null;

  return (
    <OrderSampleContext.Provider value={value}>
      {children}
    </OrderSampleContext.Provider>
  );
}

export function OrderSampleFields({
  stageLabel,
  stagePlaceholder,
  marketLabel,
  marketPlaceholder,
  markets,
}: {
  stageLabel: string;
  stagePlaceholder: string;
  marketLabel: string;
  marketPlaceholder: string;
  markets: string[];
}) {
  const { stages, selectedId, setSelectedId, selected } = useOrderSample();

  return (
    <div className={styles.previewBlock}>
      <div className={styles.preview}>
        <label className={styles.field}>
          <span>{stageLabel}</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            aria-label={stageLabel || stagePlaceholder}
          >
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>{marketLabel}</span>
          <select disabled defaultValue="">
            <option value="">{marketPlaceholder}</option>
            {markets.map((market) => (
              <option key={market}>{market}</option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.panelKit}>
        <Image
          key={selected.id}
          src={selected.kitSrc}
          alt={selected.name}
          width={720}
          height={480}
          quality={90}
          className={styles.panelKitImg}
        />
        <p className={styles.panelKitName}>{selected.name}</p>
      </div>
    </div>
  );
}
