import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGRENDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

class BurgerBuilder extends Component {
	state = {
		ingredients:{
			salad: 0,
			bacon: 0,
			cheese: 0,
			meat: 0 
		},
		totalPrice: 4,
		purchasable: false,
		purchasing: false
	}

	updatePurchaseState(ingredients){
		// const ingredients = {
		// 	...this.state.ingredients
		// };
		const sum = Object.keys(ingredients)
			.map(igkey=> {
				return ingredients[igkey];
			})
			.reduce((sum, el)=>{
				return sum + el;
			},0);
			this.setState({purchasable: sum>0});
	}

	addIngredientHandler = (type) =>{
		const oldCount = this.state.ingredients[type];
		const updatedCount = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceAddition = INGRENDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice =  oldPrice + priceAddition;
		this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
		this.updatePurchaseState(updatedIngredients);

	}

	removeIngredientHandler = (type) =>{
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0){
			return;
		}
		const updatedCount = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceDeduction = INGRENDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice =  oldPrice - priceDeduction;
		this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
		this.updatePurchaseState(updatedIngredients); 
	}

	purchaseHandler =()=>{
		this.setState({purchasing: true});
	}

	purchaseCancelHandler =() =>{
		this.setState({purchasing: false});
	}

	purchaseContinueHandler = () => {
		alert('You continue!');
	}

	render(){
		const disableInfo ={
			...this.state.ingredients
		}
		for(let key in disableInfo){
			disableInfo[key] = disableInfo[key] <= 0;  
		}
		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
					<OrderSummary 
					totalPrice={this.state.totalPrice}
					purchaseCancelled={this.purchaseCancelHandler}
					purchaseContinued={this.purchaseContinueHandler}
					ingredients={this.state.ingredients} />
				</Modal>
				<Burger ingredients={this.state.ingredients} />
				<BuildControls 
					ingredientAdded={this.addIngredientHandler}
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disableInfo}
					ordered={this.purchaseHandler}
					price={this.state.totalPrice}
					purchasable={this.state.purchasable}/>
			</Aux>
			);
	}
}

export default BurgerBuilder;