'use client';

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export default function EstadoVacio({
  title = 'No hay datos en la tabla',
  description,
}: EmptyStateProps) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <span className="empty-state__icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
          <path
            d="M14 14h20c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H14c-1.1 0-2-.9-2-2V16c0-1.1.9-2 2-2Zm4 6h12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          <path
            d="M20 26h8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.35" />
          <circle cx="36" cy="12" r="2" fill="currentColor" opacity="0.35" />
        </svg>
      </span>
      <p className="empty-state__title">{title}</p>
      {description ? (
        <p className="empty-state__description">{description}</p>
      ) : null}
    </div>
  );
}
