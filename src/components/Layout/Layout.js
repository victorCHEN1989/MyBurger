import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
	state = {
		showSiderDrawer: false
	}

	SideDrawerClosedHandler = () => {
		this.setState({showSiderDrawer: false});
	}

	SideDrawerToggleHandler = () => {
		this.setState((prevState) => { return {showSiderDrawer: !prevState.showSiderDrawer};
		});
	}

	render () {
		return (
			<Aux> 
				<Toolbar DrawerToggleClicked={this.SideDrawerToggleHandler}/>
				<SideDrawer 
				open={this.state.showSiderDrawer}
				closed={this.SideDrawerClosedHandler}/>
				<main className={classes.Content}>
					{this.props.children}
				</main>
			</Aux>
		)
	
	}
}

export default Layout;   