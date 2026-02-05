/**
 * Tailwind configuration for the frontend project.
 * Adds a custom color `beige` that you can use as `bg-beige`, `text-beige`, etc.
 */
module.exports = {
  content: [
    './src/**/*.{html,ts,css,scss}',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        // custom beige color
        beige: '#DAD7CD',
      },
    },
  },
  plugins: [],
}
