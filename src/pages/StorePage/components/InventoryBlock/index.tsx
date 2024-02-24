import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import format from '@/utils/functions/format';

export const InventoryBlock = () => {
    const player = useSelector((state: RootState) => state.player);

    return (
        <div className='relative flex h-full w-60 flex-col gap-2 rounded-box border border-neutral p-6'>
            <span className='absolute -top-3 left-4 bg-base-100 px-2 py-1 text-sm font-medium'>Inventário</span>

            {player ? (
                <>
                    <div className='flex justify-between text-sm'>
                        <span className='opacity-75'>Dinheiro</span>
                        <span className='font-medium'>{format.money(player.inventory.money)}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <span className='opacity-75'>Pokébola</span>
                        <span className='font-medium'>{player.inventory.pokeballs.simple}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <span className='opacity-75'>Super pokébola</span>
                        <span className='font-medium'>{player.inventory.pokeballs.simple}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <span className='opacity-75'>Poção</span>
                        <span className='font-medium'>{player.inventory.potions.simple}</span>
                    </div>
                </>
            ) : (
                <span className='loading loading-spinner mx-auto text-primary' />
            )}
        </div>
    );
};
