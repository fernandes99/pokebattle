import { MdLogout, MdOutlineLocalGroceryStore, MdOutlineTravelExplore } from 'react-icons/md';
import { RiTrophyLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { ThemeList } from '../ThemeList';

export const Navigation = () => {
    return (
        <div>
            <ul className='flex items-center gap-2'>
                <li>
                    <Link to='/' className='btn btn-ghost btn-sm'>
                        <MdOutlineTravelExplore />
                        Explorar
                    </Link>
                </li>
                <li>
                    <Link to='/' className='btn btn-ghost btn-sm'>
                        <RiTrophyLine />
                        Torneios
                    </Link>
                </li>
                <li>
                    <Link to='/loja' className='btn btn-ghost btn-sm'>
                        <MdOutlineLocalGroceryStore />
                        Loja
                    </Link>
                </li>
                <li>
                    <Link to='/bem-vindo' className='btn btn-ghost btn-sm'>
                        <MdLogout />
                        Sair
                    </Link>
                </li>
                <div className='mx-4 h-8 w-[1px] bg-neutral/50' />
                <ThemeList />
            </ul>
        </div>
    );
};
