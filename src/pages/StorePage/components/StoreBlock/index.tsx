import { useMemo, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import { RootState } from '@/store';
import format from '@/utils/functions/format';
import { addPlayerPokeballs, addPlayerPotions, setPlayerMoney } from '@/store/reducers/player';

const SHOP_VALUES = {
    pokeballs: 100,
    potions: 80
};

export const StoreBlock = () => {
    const dispatch = useDispatch();
    const player = useSelector((state: RootState) => state.player!);
    const [items, setItems] = useState({
        potions: 0,
        pokeballs: 0
    });

    const total = useMemo(() => {
        return items.potions * SHOP_VALUES.potions + items.pokeballs * SHOP_VALUES.pokeballs;
    }, [items]);

    const handleChangeItem = (item: 'potions' | 'pokeballs', value: number) => {
        if (value >= 0) {
            setItems({ ...items, [item]: value });
        }
    };

    const buyItems = () => {
        if (total > player.inventory.money) {
            return toast.error('Você é pobre, e não tem dinheiro suficiente.');
        }

        dispatch(setPlayerMoney(player.inventory.money - total));
        dispatch(addPlayerPokeballs(items.pokeballs));
        dispatch(addPlayerPotions(items.potions));

        toast.success('Itens comprados!');
    };

    return (
        <div className='relative rounded-box border border-neutral pb-4 pl-6 pr-4 pt-6'>
            <span className='absolute -top-3 left-4 bg-base-100 px-2 py-1 text-sm font-medium'>Loja</span>
            <div>
                <ul className='flex flex-col gap-2'>
                    <li className='grid grid-cols-[2fr,2fr,1fr] items-center'>
                        <span className='mr-4'>Pokebola</span>
                        <span className='mx-8 text-green-500'>R$ {SHOP_VALUES.pokeballs}</span>
                        <div>
                            <button
                                className='btn btn-circle btn-ghost btn-sm'
                                onClick={() => setItems({ ...items, pokeballs: items.pokeballs + 1 })}
                            >
                                <FaPlus size={12} />
                            </button>
                            <input
                                type='number'
                                className='remove-appearance input input-sm input-bordered w-8 rounded-btn px-1 pt-[2px] text-center'
                                value={items.pokeballs}
                                onChange={(event) => handleChangeItem('pokeballs', parseInt(event.target.value))}
                            />
                            <button
                                className='btn btn-circle btn-ghost btn-sm'
                                onClick={() => setItems({ ...items, pokeballs: items.pokeballs - 1 })}
                            >
                                <FaMinus size={12} />
                            </button>
                        </div>
                    </li>
                    <li className='grid grid-cols-[2fr,2fr,1fr] items-center'>
                        <span className='mr-4'>Poção</span>
                        <span className='mx-8 text-green-500'>R$ {SHOP_VALUES.potions}</span>
                        <div>
                            <button
                                className='btn btn-circle btn-ghost btn-sm'
                                onClick={() => setItems({ ...items, potions: items.potions + 1 })}
                            >
                                <FaPlus size={12} />
                            </button>
                            <input
                                type='number'
                                className='remove-appearance input input-sm input-bordered w-8 rounded-btn px-1 pt-[2px] text-center'
                                value={items.potions}
                                onChange={(event) => handleChangeItem('potions', parseInt(event.target.value))}
                            />
                            <button
                                className='btn btn-circle btn-ghost btn-sm'
                                onClick={() => setItems({ ...items, potions: items.potions - 1 })}
                            >
                                <FaMinus size={12} />
                            </button>
                        </div>
                    </li>
                </ul>

                <div className='my-6 h-[1px] w-full bg-neutral/50' />

                <div className='grid grid-cols-[2fr,2fr,1fr] items-center'>
                    <span className='mr-4'>Total</span>
                    <span className='mx-8 text-green-500'>{format.money(total)}</span>
                    <button className='btn btn-primary btn-sm' onClick={buyItems}>
                        Comprar
                    </button>
                </div>
            </div>
        </div>
    );
};
