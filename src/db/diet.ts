import connectDB from "@/lib/connectDB";
import Diet from "@/models/Diet/Diet";
import Meal from "@/models/Diet/Meal";

export async function getDietInfo(dietID: string) {
    try {
        await connectDB();
        const dietInfo = await Diet.findOne({
            _id: dietID,
        }).populate('meals');
        return dietInfo;
    } catch (e) {
        return { error: e };
    }

}

export async function addMealToDiet(dietID: string, mealDay: number, mealName: string, foods: { foodID: string, name: string, quantity: number }[]) {
    try {
        await connectDB();
        const dietInfo = await Diet.findOne({
            _id: dietID
        });
        if (!dietInfo) {
            return { error: "Diet not found" };
        }
        const meal = new Meal({
            day: mealDay,
            name: mealName,
            foods: foods
        });
        await meal.save();
        dietInfo.meals.push(meal);
        await dietInfo.save();
        return dietInfo;
    } catch (e) {
        return { error: e };
    }
}

export async function deleteFoodFromMeal(dietID: string, mealID: string, foodID: string){
    try {
        await connectDB();
        const dietInfo = await Diet.findOne({
            _id: dietID
        });
        if (!dietInfo) {
            return { error: "Diet not found" };
        }
        const meal = await Meal.findOne({
            _id: mealID
        });
        if (!meal) {
            return { error: "Meal not found" };
        }
        meal.foods = meal.foods.filter((food : any) => food.foodID !== foodID);
        await meal.save();
        return dietInfo;
    } catch (e) {
        return { error: e };
    }
}

export async function deleteMeal(dietID: string, mealID: string){
    try {
        await connectDB();
        const del = await Meal.deleteOne({
            _id: mealID
        });
        if (del.deletedCount === 0) {
            return { error: "Meal not found" };
        }
        const dietInfo = await Diet.findOne({
            _id: dietID
        });
        if (!dietInfo) {
            return { error: "Diet not found" };
        }
        dietInfo.meals = dietInfo.meals.filter((meal: any) => !meal.equals(mealID));
        await dietInfo.save();
        return dietInfo;
    } catch (e) {
        return { error: e };
    }
}


