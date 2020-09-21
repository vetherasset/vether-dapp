import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Layout } from 'antd'
import 'antd/dist/antd.less'

import Notification from './ui/layout/Notification'
import Header from './ui/layout/Header'
import Footer from './ui/layout/Footer'
import Sidebar from './ui/layout/Sidebar'
import Hero from './ui/pages/Hero'
import Acquire from './ui/pages/Acquire'
import Pool from './ui/pages/Pool'
import Swap from './ui/pages/Swap'
import Stats from './ui/pages/Stats'
import Whitepaper from './ui/pages/Whitepaper'
import Donations from './ui/pages/Donations'
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
						<Sidebar />
						<Content style={{ color: Colour().white }}>
							<div className="ant-wrapper">
								<Switch>
									<Route path="/" exact component={Hero} />
									<Route path="/overview" exact component={Hero} />
									<Route path="/acquire" exact component={Acquire} />
									<Route path="/claim" exact component={Acquire} />
									<Route path="/swap" exact component={Swap} />
									<Route path="/pool" exact component={Pool} />
									<Route path="/stats" exact component={Stats} />
									<Route path="/whitepaper" exact component={Whitepaper} />
									<Route path="/donations" exact component={Donations} />
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
