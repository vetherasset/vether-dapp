export default {
	baseStyle: {
		fontFamily: 'Button',
		lineHeight: '0px',
		_focus: {
			boxShadow: '0 0 0 3px rgba(206, 150, 0, 0.6)',
		},
	},
	variants: {
		solid: () => ({
			color: 'rgb(17, 13, 1)',
			bg: 'rgb(255, 186, 0)',
			_hover: {
				bg: '#ffc300',
			},
			_active: {
				bg: '#ffd000',
			},
			_disabled: {
				bg: 'transparent',
			},
		}),
	},
}
