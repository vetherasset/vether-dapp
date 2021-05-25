export default {
	baseStyle: {
		fontFamily: 'Button',
		lineHeight: '0px',
		borderRadius: '4px',
		_focus: {
			boxShadow: '0 0 0 3px #ff8ac091',
		},
	},
	variants: {
		solid: () => ({
			color: '#000',
			transition: '0.7s',
			backgroundSize: '150% auto',
			backgroundImage: 'linear-gradient(90deg,#ff65ac  0%, #FFBF00 100%)',
			_hover: {
				backgroundSize: '150% auto',
				backgroundPosition: 'right center',
				backgroundImage: 'linear-gradient(90deg,#ff65ac  0%, #FFBF00 100%)',
			},
			_active: {
				backgroundSize: '150% auto',
				backgroundPosition: 'right center',
				backgroundImage: 'linear-gradient(90deg,#f573af  0%, #ffc300 100%)',
			},
			_disabled: {
				bg: 'transparent',
			},
		}),
		outline: () => ({
			color: 'accent',
			border: 'none',
			backgroundSize: '150% auto',
			backgroundImage: 'linear-gradient(90deg,#ff65ac  0%, #FFBF00 100%)',
			p: '1px',
			_hover: {
				backgroundSize: '150% auto',
				backgroundPosition: 'right center',
				backgroundImage: 'linear-gradient(90deg,#ff65ac  0%, #FFBF00 100%)',
			},
			_active: {
			},
			_disabled: {
				bg: 'transparent',
			},
		}),
		link: () => ({
			color: '#fff',
			height: 'auto',
    	padding: '0',
			_active: {
				color: '#fff',
				opacity: '0.6',
			},
		}),
		linkAccent: () => ({
			color: 'accent',
			height: 'auto',
    	padding: '0',
			_hover: {
				textDecoration: 'underline',
			},
			_active: {
				color: 'accent',
				opacity: '0.6',
			},
		}),
	},
}
