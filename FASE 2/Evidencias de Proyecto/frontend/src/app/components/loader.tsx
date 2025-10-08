'use client';

type LoaderProps = {
  label?: string;
};

export default function Loader({ label = 'Cargando datos...' }: LoaderProps) {
  return (
    <div className="inventory-loader" role="status" aria-live="polite">
      <span className="inventory-loader__spinner" aria-hidden="true">
        <span className="inventory-loader__ring inventory-loader__ring--outer" />
        <span className="inventory-loader__ring inventory-loader__ring--inner" />
      </span>
      <span className="inventory-loader__label">{label}</span>
    </div>
  );
}
