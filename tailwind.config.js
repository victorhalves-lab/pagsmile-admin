/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'system-ui', 'sans-serif'],
  			mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'card-v7': '14px',
  			'pill': '999px'
  		},
  		boxShadow: {
  			'v7-card': '0 1px 0 rgba(0, 36, 67, 0.04), 0 6px 24px -16px rgba(0, 36, 67, 0.18)',
  			'v7-card-hover': '0 1px 0 rgba(0, 36, 67, 0.06), 0 12px 32px -16px rgba(0, 36, 67, 0.24)',
  			'v7-glow-mint': '0 0 0 1px #9cebc9, 0 8px 24px -8px rgba(43, 193, 150, 0.35)',
  		},
  		colors: {
  			pag: {
  				mint: {
  					50: '#e8faf3', 100: '#c5f3e0', 200: '#9cebc9', 300: '#6fe1b1', 400: '#4cd5a3',
  					500: '#2bc196', 600: '#20a780', 700: '#18866a', 800: '#126653', 900: '#0c4a3d',
  				},
  				navy: {
  					50: '#e6ecf2', 100: '#c0cfdc', 200: '#8aa5bd', 300: '#547c9d', 400: '#2c577f',
  					500: '#013766', 600: '#002d56', 700: '#002443', 800: '#001b34', 900: '#001124',
  				},
  				highlight: {
  					400: '#88f9d9', 500: '#5cf7cf', 600: '#2cebbb', 700: '#15c79a',
  				},
  				teal: {
  					400: '#4d847f', 500: '#36706c', 600: '#2c5e5a', 700: '#234a47',
  				},
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}