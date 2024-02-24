/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'ui-sans-serif', 'system-ui']
            },
            animation: {
                fade: 'fade-in .5s ease-in-out'
            },
            keyframes: {
                'fade-in': {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                }
            }
        }
    },
    daisyui: {
        themes: ['night', 'synthwave', 'retro', 'cyberpunk', 'fantasy', 'nord', 'sunset', 'business', 'dim', 'dracula']
    },

    plugins: [require('daisyui')]
};
