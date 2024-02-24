import { MdOutlineColorLens } from 'react-icons/md';

export const ThemeList = () => (
    <div className='dropdown'>
        <div tabIndex={0} role='button' className='btn btn-ghost btn-sm'>
            <MdOutlineColorLens />
            Tema
            <svg
                width='12px'
                height='12px'
                className='inline-block h-2 w-2 fill-current opacity-60'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 2048 2048'
            >
                <path d='M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z'></path>
            </svg>
        </div>
        <ul tabIndex={0} className='dropdown-content z-[1] w-52 rounded-box bg-base-300 p-2 shadow-2xl'>
            <li>
                <input
                    type='radio'
                    name='theme-dropdown'
                    className='theme-controller btn btn-ghost btn-sm btn-block justify-start'
                    aria-label='Default'
                    value='default'
                />
            </li>
            <li>
                <input
                    type='radio'
                    name='theme-dropdown'
                    className='theme-controller btn btn-ghost btn-sm btn-block justify-start'
                    aria-label='Synthwave'
                    value='synthwave'
                />
            </li>
            <li>
                <input
                    type='radio'
                    name='theme-dropdown'
                    className='theme-controller btn btn-ghost btn-sm btn-block justify-start'
                    aria-label='Retro'
                    value='retro'
                />
            </li>
            <li>
                <input
                    type='radio'
                    name='theme-dropdown'
                    className='theme-controller btn btn-ghost btn-sm btn-block justify-start'
                    aria-label='Cyberpunk'
                    value='cyberpunk'
                />
            </li>
            <li>
                <input
                    type='radio'
                    name='theme-dropdown'
                    className='theme-controller btn btn-ghost btn-sm btn-block justify-start'
                    aria-label='Fantasy'
                    value='fantasy'
                />
            </li>
            <li>
                <input
                    type='radio'
                    name='theme-dropdown'
                    className='theme-controller btn btn-ghost btn-sm btn-block justify-start'
                    aria-label='Nord'
                    value='nord'
                />
            </li>
            <li>
                <input
                    type='radio'
                    name='theme-dropdown'
                    className='theme-controller btn btn-ghost btn-sm btn-block justify-start'
                    aria-label='Sunset'
                    value='sunset'
                />
            </li>
            <li>
                <input
                    type='radio'
                    name='theme-dropdown'
                    className='theme-controller btn btn-ghost btn-sm btn-block justify-start'
                    aria-label='Business'
                    value='business'
                />
            </li>
            <li>
                <input
                    type='radio'
                    name='theme-dropdown'
                    className='theme-controller btn btn-ghost btn-sm btn-block justify-start'
                    aria-label='Dim'
                    value='dim'
                />
            </li>
            <li>
                <input
                    type='radio'
                    name='theme-dropdown'
                    className='theme-controller btn btn-ghost btn-sm btn-block justify-start'
                    aria-label='Dracula'
                    value='dracula'
                />
            </li>
        </ul>
    </div>
);
