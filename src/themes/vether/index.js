import { mode } from '@chakra-ui/theme-tools'
import typography from './typography'
import colors from './colors'
import button from './button'
import input from './input'
import { extendTheme } from '@chakra-ui/react'
import defaults from '../../common/defaults'

const overrides = {
	config: {
		useSystemColorMode: false,
		initialColorMode: defaults.theme.mode,
	},
	styles: {
		global: props => ({
			body: {
				fontFamily: 'Body',
				fontSize: '1em',
				fontWeight: '300',
				bg: mode('#ffffff', '#110D02')(props),
			},
			'button:focus': {
				boxShadow: '0 0 0 3px rgba(206, 150, 0, 0.6)!important',
			},
		}),
	},
	textStyles: typography,
	colors: colors,
	components: {
		Button: button,
		Input: input,
	},
}

export default extendTheme(overrides)
