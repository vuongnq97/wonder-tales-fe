export default function LoadingSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-2xl bg-white border border-surface-200/80 overflow-hidden"
                >
                    <div className="h-44 shimmer" />
                    <div className="p-5 space-y-3">
                        <div className="h-5 w-3/4 rounded-lg shimmer" />
                        <div className="space-y-2">
                            <div className="h-3 w-full rounded shimmer" />
                            <div className="h-3 w-5/6 rounded shimmer" />
                            <div className="h-3 w-2/3 rounded shimmer" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
