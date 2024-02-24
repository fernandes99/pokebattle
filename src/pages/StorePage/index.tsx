import { Navigation } from '@/components/Navigation';
import { StoreBlock } from './components/StoreBlock';
import { InventoryBlock } from './components/InventoryBlock';

function StorePage() {
    return (
        <div className='flex h-dvh w-dvw flex-col items-center justify-center gap-4 bg-base-300 p-6'>
            <Navigation />
            <div className='container flex w-fit items-center justify-center gap-3 rounded-box bg-base-100 p-6 shadow-lg'>
                <StoreBlock />
                <InventoryBlock />
            </div>
        </div>
    );
}

export default StorePage;
