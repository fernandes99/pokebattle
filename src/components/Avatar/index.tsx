interface AvatarProps {
    src: string;
    color: string;
    alt: string;
    bgRadius?: number;
    size?: number;
}

export const Avatar = ({ alt, src, color, size = 96, bgRadius = 75 }: AvatarProps) => {
    return (
        <div className={`relative z-0 size=[${size}px] max-h-[${size}px]`} style={{ maxHeight: size, maxWidth: size }}>
            <div
                className={`absolute left-0 top-0 -z-10 h-full w-full rounded-full`}
                style={{
                    background: `radial-gradient(circle, ${color} 0%, ${color}00 ${bgRadius}%)`,
                    opacity: 0.25
                }}
            />
            <img src={src} alt={alt} width={size} height={size} className='object-scale-down' style={{ maxHeight: size, maxWidth: size }} />
        </div>
    );
};
