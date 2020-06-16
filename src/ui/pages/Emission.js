import React from 'react';

import '../App.less';
import { H2, Subtitle, Gap, HR } from '../components'
import { EmissionTable } from '../content'

const Emission = (props) => {

	return (
		<div>
			<br></br>
			<H2>EMISSION SCHEDULE</H2><br />
			<Subtitle>The Emission Schedule is as follows: </Subtitle>
			<Gap />
			<EmissionTable />
			<Gap />
			<HR />
		</div>
	)
}

export default Emission
