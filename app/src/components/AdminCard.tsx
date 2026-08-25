"use client";

import React from "react";

export interface AdminCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  children: React.ReactNode;
  className?: string;
}

export const AdminCard = ({
  title,
  subtitle,
  action,
  icon: Icon,
  children,
  className = "",
}: AdminCardProps) => {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md ${className}`}
    >
      {(title || action || Icon) && (
        <div className="mb-5 flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                <Icon size={18} />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>

          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};
