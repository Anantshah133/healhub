export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#43d47b',
            },
            gridTemplateColumns : {
                'auto': 'repeat(auto-fill, minmax(250px, 1fr))',
            }
        },
    },
    plugins: [],
}