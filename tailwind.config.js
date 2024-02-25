/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'ui-sans-serif', 'system-ui']
            },
            animation: {
                fade: 'fade-in .25s ease-in-out',
                injure: 'on-injure .25s ease-in-out',
                'attack-bottom': 'on-attack-bottom .5s ease-in-out',
                'attack-top': 'on-attack-top .5s ease-in-out'
            },
            keyframes: {
                'fade-in': {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                },
                'on-injure': {
                    '0%': { opacity: 1, transform: 'translateX(0px)' },
                    '25%': { opacity: 0.25, transform: 'translateX(8px)' },
                    '50%:': { opacity: 0.25, transform: 'translateX(0px)' },
                    '85%': { opacity: 0.25, transform: 'translateX(-8px)' },
                    '100%': { opacity: 1, transform: 'translateX(0px)' }
                },
                'on-attack-bottom': {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(12px)' },
                    '100%': { transform: 'translateX(0px)' }
                },
                'on-attack-top': {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                    '100%': { transform: 'translateX(0px)' }
                }
            }
        }
    },
    daisyui: {
        themes: ['night', 'synthwave', 'retro', 'cyberpunk', 'fantasy', 'nord', 'sunset', 'business', 'dim', 'dracula']
    },

    plugins: [require('daisyui')]
};
