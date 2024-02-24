import { getPercentage } from '@/utils/functions/number';

interface ProgressProps {
    value: number;
    max: number;
    height?: number;
    color?: string;
}

export const Progress = ({ value, max, color, height = 6 }: ProgressProps) => {
    const percentage = getPercentage(value, max);
    const getColor = () => {
        if (color) return color;
        if (percentage >= 50) return '#2fd671';
        if (percentage >= 20) return '#c8d433';
        return '#d64646';
    };

    return (
        <div className='relative w-full'>
            <span className='absolute bottom-3 right-0 text-xs font-semibold' style={{ color: getColor() }}>
                {Math.round(value)}/{Math.round(max)}
            </span>

            <div className='relative w-full overflow-hidden rounded-full' style={{ background: `${getColor()}50`, height: `${height}px` }}>
                <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${percentage < 20 ? 'animate-pulse' : ''}`}
                    style={{ background: getColor(), width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
