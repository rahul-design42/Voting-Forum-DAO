import React from 'react';
import { motion } from 'framer-motion';

/* Animated shimmer keyframe is defined in index.css */

function SkeletonLine({ className = '' }) {
  return (
    <div className={`skeleton-shimmer rounded-lg ${className}`} />
  );
}

export function ProposalSkeleton() {
  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div className="h-1 w-full rounded-t-[1.25rem] skeleton-shimmer -mx-6 -mt-6 mb-0 rounded-none" style={{width:'calc(100% + 48px)'}} />
      <div className="flex items-start justify-between gap-3 mt-1">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex gap-2">
            <SkeletonLine className="h-5 w-16" />
            <SkeletonLine className="h-5 w-8" />
          </div>
          <SkeletonLine className="h-6 w-3/4 mt-1" />
        </div>
      </div>
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-5/6" />
      <div className="h-3 w-full rounded-full skeleton-shimmer" />
      <div className="flex gap-3 pt-1">
        <SkeletonLine className="flex-1 h-10 rounded-xl" />
        <SkeletonLine className="flex-1 h-10 rounded-xl" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <SkeletonLine className="h-4 w-28" />
        <SkeletonLine className="h-9 w-9 rounded-xl" />
      </div>
      <SkeletonLine className="h-9 w-20" />
      <SkeletonLine className="h-1.5 w-full rounded-full" />
    </div>
  );
}
