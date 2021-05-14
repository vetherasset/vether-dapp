export default {
	baseStyle: {
		fontFamily: 'Button',
		lineHeight: '0px',
		borderRadius: '4px',
		_focus: {
			boxShadow: '0 0 0 3px rgba(206, 150, 0, 0.6)',
		},
	},
	variants: {
		solid: () => ({
			color: '#000',
			bg: 'accent',
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
