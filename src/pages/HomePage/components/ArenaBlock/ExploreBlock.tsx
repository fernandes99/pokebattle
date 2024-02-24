interface ExploreBlockProps {
    onExplore: () => void;
}

export const ExploreBlock = ({ onExplore }: ExploreBlockProps) => {
    return (
        <div className='flex h-full w-full animate-pulse flex-col items-center justify-center overflow-hidden'>
            <span>Procure por um</span>
            <strong>pokemon selvagem</strong>
            <button onClick={onExplore} className='btn btn-primary btn-sm mt-3 px-4'>
                Procurar
            </button>
        </div>
    );
};
