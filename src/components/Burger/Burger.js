import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';


const burger = (props) =>{
	console.log(props);
	let transformeIngredients = Object.keys(props.ingredients)
		.map(igKey => {
			return [...Array(props.ingredients[igKey])].map((_, i)=>{
				return <BurgerIngredient key={igKey + i} type={igKey} />
			});
		})
		.reduce((arr, el)=> {
			return arr.concat(el)
		}, []);

	if(transformeIngredients.length === 0){
		transformeIngredients = <p>Please start adding ingredients!</p>;
	}
		//console.log(Object.keys(props.ingredients));
	return (
		<div className={classes.Burger}>
			<BurgerIngredient type="bread-top"/>
			{transformeIngredients}
			<BurgerIngredient type="bread-bottom"/>
		</div> 
	);
};

export default burger;