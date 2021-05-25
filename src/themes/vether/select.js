export default {
	variants: {
		filled: () => ({
			field: {
				background: 'white',
				borderColor: 'accent',
				_hover: {
					background: 'white',
				},
				_focus: {
					borderColor: '#ff8ac0',
					background: 'white',
				},
			},
		}),
	},
}
