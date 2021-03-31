import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Layout } from 'antd'
import 'antd/dist/antd.less'

import Notification from './ui/layout/Notification'
import Header from './ui/layout/Header'
import Footer from './ui/layout/Footer'
import Stats from './ui/pages/Stats'
import { Colour } from './ui/components'

import { ContextProvider } from './context'

import { BreakpointProvider } from 'react-socks'

const { Content } = Layout

const App = () => {

	const betaWarning = () => { return  (
			<>
				This feature is beta, so there is a <b>risk involved</b>.
			</>
		)
	}

	return (
		<Router>
			<ContextProvider>
				<BreakpointProvider>
					<Switch>
						<Route path="/pool">
							<Notification message={betaWarning()} pathname={'pool'}/>
						</Route>

						<Route path="/swap">
							<Notification message={betaWarning()} pathname={'swap'}/>
						</Route>
					</Switch>

					<Header/>

					<main>
						<Content style={{ color: Colour().white }}>
							<div className="ant-wrapper">
								<Switch>
									<Route path="/" exact component={Stats} />
								</Switch>
								<Footer/>
							</div>
						</Content>
					</main>

				</BreakpointProvider>
			</ContextProvider>
		</Router>
	);
}

export default App
