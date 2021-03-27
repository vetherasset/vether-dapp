import React, { useEffect, useState } from 'react'
import { Flex, Container } from '@chakra-ui/react'
import defaults from '../common/defaults'
import { getNextDayTime } from '../common/ethereum'
import Countdown from 'react-countdown'

export const Overview = (props) => {

	const [nextDayTime, setNextDayTime] = useState(undefined)

	const timer = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			return <>One more burn to start new day.</>
		}
		else {
			return <>{hours}:{minutes}:{seconds}</>
		}
	}

	useEffect(() => {
		getNextDayTime(defaults.network.provider)
			.then(n => setNextDayTime(
				Number(n.toString()) * 1000),
			)
	}, [])

	return (
		<Flex {...props}>
			<Container>
				<h2>Remaining Time</h2>
				{nextDayTime &&
						<span>
							<Countdown
								renderer={timer}
								daysInHours={true}
								date={nextDayTime} />
						</span>
				}
			</Container>
		</Flex>
	)
}
