export function GlowOrb({
    className = "",
    color = "bg-primary/20",
}: {
    className?: string;
    color?: string;
}) {
    return (
        <div
            className={`absolute rounded-full pointer-events-none -z-10 blur-[100px] ${color} ${className}`}
            aria-hidden="true"
        />
    );
}
