import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from 'antd';
import 'antd/dist/antd.css'

import Sidebar from './ui/layout/Sidebar'
import Hero from './ui/pages/Hero'
import Acquire from './ui/pages/Acquire'
import Claim from './ui/pages/Claim'
import Whitepaper from './ui/pages/Whitepaper'
import { Colour } from './ui/components'

import { BreakpointProvider } from 'react-socks';

const { Content } = Layout;

const App = () => {

	return (
		<Router>
			<div>
				<BreakpointProvider>
					<Layout style={{height:"100vh"}}>
						<Sidebar />
						<Content style={{ background: Colour().dgrey, color: Colour().white , paddingLeft:50}}>
							<Switch>
								<Route path="/" exact component={Hero} />
								<Route path="/overview" exact component={Hero} />
								<Route path="/acquire" exact component={Acquire} />
								<Route path="/claim" exact component={Claim} />
								<Route path="/whitepaper" exact component={Whitepaper} />
							</Switch>
						</Content>
					</Layout>
				</BreakpointProvider>
			</div>
		</Router>
	);
}

export default App;