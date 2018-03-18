import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGRENDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

class BurgerBuilder extends Component {
	state = {
		ingredients: null,
		totalPrice: 4,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: false
	}

	componentDidMount () {
		console.log(this.props);
		axios.get('https://react-my-burger-8f976.firebaseio.com/ingredients.json')
		.then(response =>{
			this.setState({ingredients: response.data});
		})
		.catch(error => {
			this.setState({error: true});
		});
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

	purchaseHandler = () => {
		this.setState({purchasing: true});
	}

	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}

	purchaseContinueHandler = () => {
		//alert('You continue!');

		const queryParams = [];
		for (let i in this.state.ingredients) {
			queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
		}
		queryParams.push('price=' + this.state.totalPrice);
		const queryString = queryParams.join('&');
		this.props.history.push({
			pathname: '/checkout',
			search: '?' + queryString
		});
	}

	render(){
		const disableInfo ={
			...this.state.ingredients
		}
		for(let key in disableInfo){
			disableInfo[key] = disableInfo[key] <= 0;  
		}

		let orderSumary = null;

		let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner / >;

		if (this.state.ingredients) {
			burger = (
				<Aux>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls 
						ingredientAdded={this.addIngredientHandler}
						ingredientRemoved={this.removeIngredientHandler}
						disabled={disableInfo}
						ordered={this.purchaseHandler}
						price={this.state.totalPrice}
						purchasable={this.state.purchasable} />
				</Aux>
			);
			orderSumary = <OrderSummary 
				totalPrice = {this.state.totalPrice}
				purchaseCancelled={this.purchaseCancelHandler}
				purchaseContinued={this.purchaseContinueHandler}
				ingredients={this.state.ingredients} />;
			if (this.state.loading) {
				orderSumary = <Spinner />;
			}

		}
		

		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
					{orderSumary}
				</Modal>
				 {burger}
			</Aux>
			);
	}
}

export default withErrorHandler(BurgerBuilder, axios);