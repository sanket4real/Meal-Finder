const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const singleMealEl = document.getElementById("single-meal");

//fetching meal from api
function searchMeal(e) {
	e.preventDefault();

	//clear single meal
	singleMealEl.innerHTML = "";

	//Get search term
	const term = search.value;
	console.log(term);

	//check for empty
	if (term.trim()) {
		mealsEl.innerHTML = "";
		fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
			.then((res) => res.json())
			.then((data) => {
				resultHeading.innerHTML = `<h2>The search result for ${term} :</h2>`;

				if (data.meals === null) {
					resultHeading.innerHTML = `<h2>There are no search results. Please try again !</h2>`;
				} else {
					mealsEl.innerHTML = data.meals
						.map(
							(meal) => `<div class="meal">
					<img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
					<div class="meal-info" data-mealID="${meal.idMeal}">
						<h3>${meal.strMeal}</h3>
					</div>
					</div>`
						)
						.join("");
				}
			});
		//clear search text
		search.value = "";
	} else {
		alert("Please enter a search term in the input");
	}
}

//Fetch meal by ID
function getMealByID(mealID) {
	fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
		.then((res) => res.json())
		.then((data) => {
			const meal = data.meals[0];

			addMealToDOM(meal);
		});
}

//Add meal to dom
function addMealToDOM(meal) {
	const ingredients = [];

	for (let i = 1; i <= 20; i++) {
		if (meal[`strINgredient${i}`]) {
			ingredients.push(
				`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
			);
		} else {
			break;
		}
	}

	singleMealEl.innerHTML = `
	<div class="single-meal">
	<h1>${meal.strMeal}</h1>
	</div>
	`;
}

//Event Listeners
submit.addEventListener("submit", searchMeal);

mealsEl.addEventListener("click", (e) => {
	const mealInfo = e.path.find((item) => {
		if (item.classList) {
			return item.classList.contains("meal-info");
		} else {
			return false;
		}
	});
	console.log(mealInfo);
	if (mealInfo) {
		const mealID = mealInfo.getAttribute("data-mealID");
		getMealByID(mealID);
	}
});
