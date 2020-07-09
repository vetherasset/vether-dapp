import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from 'antd';
import 'antd/dist/antd.less'

import Notification from './ui/layout/Notification'
import Header from './ui/layout/Header'
import Footer from './ui/layout/Footer'
import Sidebar from './ui/layout/Sidebar'
import Hero from './ui/pages/Hero'
import Acquire from './ui/pages/Acquire'
//import Upgrade from './ui/pages/Upgrade'
// import Stake from './ui/pages/Stake'
import Trade from './ui/pages/Trade'
import Stats from './ui/pages/Stats'
import Whitepaper from './ui/pages/Whitepaper'
import { Colour } from './ui/components'

import { ContextProvider } from './context'

import { BreakpointProvider } from 'react-socks';

const { Content } = Layout;

const App = () => {

	return (
		<Router>
			<ContextProvider>
				<BreakpointProvider>
					<Notification />
					<Header/>
					<main>
						<Sidebar />
						<Content style={{ background: Colour().dgrey, color: Colour().white}}>
							<div className="ant-wrapper">
								<Switch>
									<Route path="/" exact component={Hero} />
									<Route path="/overview" exact component={Hero} />
									{/*<Route path="/upgrade" exact component={Upgrade} />*/}
									<Route path="/acquire" exact component={Acquire} />
									<Route path="/claim" exact component={Acquire} />
									{/*<Route path="/stake" exact component={Stake} />*/}
									<Route path="/trade" exact component={Trade} />
									<Route path="/stats" exact component={Stats} />
									<Route path="/whitepaper" exact component={Whitepaper} />
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

export default App;
