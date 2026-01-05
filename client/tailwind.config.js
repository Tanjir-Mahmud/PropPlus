/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    900: '#0f172a', // Default slate-900, but ensuring it matches Surface requirement if different.
                    // Requirement: Surface: Slate-900.
                    // Background: #020617.
                }
            },
            backgroundColor: {
                'app-bg': '#020617',
            }
        },
    },
    plugins: [],
}
