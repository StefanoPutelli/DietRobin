// import fs from "fs";
// Definisci l'URL base dell'API
const BASE_URL = 'https://api.webapp.prod.blv.foodcase-services.com/BLV_WebApp_WS/webresources';
const LANG = 'it';

interface foodInterfaceAPI {
    id: number;
    foodName: string;
    generic: boolean;
    categoryNames: string;
    amount: number;
    foodid: number;
    valueTypeCode: string;
}

export interface foodInterface {
    id: number;
    foodName: string;
}


export interface foodDetailsInterface {
    id: string;
    name: string;
    category: string[];


}

interface parsedNutrient {
    name: string;
    value: number;
    unit: string;
};

export interface ParsedNutritionData {
    name: string;
    category: string;
    energy: parsedNutrient[];
    mainNutrients: {
        fats: parsedNutrient[];
        carbohydrates: parsedNutrient[];
        proteins: parsedNutrient[];
        others: parsedNutrient[];
    };
    microNutrients: {
        vitamins: parsedNutrient[];
        minerals: parsedNutrient[];
    };
};

interface NutrientValue {
    id: number;
    value: number;
    references: {
        id: number;
        citation: string;
        title: string;
        authors: string;
        typeDescriptor: string;
    }[];
    component: {
        name: string;
        id: number;
        code: string;
        group: number;
        unit: number;
        sortorder: number;
        componentsets: number[];
    };
    unit: {
        name: string;
        id: number;
        code: string;
    };
    minimum: number;
    maximum: number;
    n: number;
    contrMethodTypes: string;
}

const parseNutritionData = (apiData: any): ParsedNutritionData => {
    // Definizione delle categorie dei nutrienti
    const categories = {
        energy: ["Energia, calorie", "Energia, kilojoules"],
        fats: ["Lipidi, totali", "Acidi grassi, saturi", "Acidi grassi, monoinsaturi", "Acidi grassi, polinsaturi", "Colesterolo"],
        carbohydrates: ["Glucidi, disponibili", "Zuccheri", "Amido", "Fibre alimentari"],
        proteins: ["Proteine"],
        others: ["Sale, NaCl", "Alcool", "Acqua"],
        vitamins: [
            "Vitamine A RE", "Vitamine A RAE", "Retinolo", "Attività di beta-carotene", "Beta-carotene",
            "Vitamina B1 (tiamina)", "Vitamina B2 (riboflavina)", "Vitamina B6 (piridossina)", "Vitamina B12 (cobalamina)",
            "Niacina", "Folati", "Acido pantotenico", "Vitamina C (acido ascorbico)", "Vitamina D (calciferolo)", "Attività di vitamina E"
        ],
        minerals: [
            "Potassio, K", "Sodio, Na", "Cloro, Cl", "Calcio, Ca", "Magnesio, Mg", "Fosforo, P",
            "Ferro, Fe", "Iodio, I", "Zinco, Zn", "Selenio, Se"
        ]
    };

    // Struttura dati organizzata
    const parsedData: ParsedNutritionData = {
        name: apiData.name,
        category: apiData.categories.length > 0 ? apiData.categories[0].name : "Unknown",
        energy: [],
        mainNutrients: {
            fats: [],
            carbohydrates: [],
            proteins: [],
            others: []
        },
        microNutrients: {
            vitamins: [],
            minerals: []
        }
    };

    // Mappatura dei nutrienti
    apiData.values.forEach((item: NutrientValue) => {
        const componentName = item.component.name;
        const unit = item.unit.name || "";

        if (componentName) {
            const nutrient = { name: componentName, value: item.value || 0, unit };

            if (categories.energy.includes(componentName)) {
                parsedData.energy.push(nutrient);
            } else if (categories.fats.includes(componentName)) {
                parsedData.mainNutrients.fats.push(nutrient);
            } else if (categories.carbohydrates.includes(componentName)) {
                parsedData.mainNutrients.carbohydrates.push(nutrient);
            } else if (categories.proteins.includes(componentName)) {
                parsedData.mainNutrients.proteins.push(nutrient);
            } else if (categories.others.includes(componentName)) {
                parsedData.mainNutrients.others.push(nutrient);
            } else if (categories.vitamins.includes(componentName)) {
                parsedData.microNutrients.vitamins.push(nutrient);
            } else if (categories.minerals.includes(componentName)) {
                parsedData.microNutrients.minerals.push(nutrient);
            } else {
                console.log("'" + componentName + "' is missing");
            }

        }
    });

    return parsedData;
};



function findWord(word: string, str: string) {
    return RegExp('\\b' + word + '\\b', 'i').test(str)
}

export async function searchFood(query: string): Promise<foodInterface[]> {
    const response = await fetch(`${BASE_URL}/BLV-api/foods?lang=${LANG}&search=${query}`);
    if (!response.ok) {
        throw new Error(`Errore nella richiesta: ${response.statusText}`);
    }
    const data = await response.json() as foodInterfaceAPI[];

    const wordMatchData = [] as foodInterface[];
    const notWordMatchData = [] as foodInterface[];

    data.forEach((food) => {
        if (findWord(query, food.foodName)) {
            wordMatchData.push({
                id: food.id,
                foodName: food.foodName,
            });
        } else {
            notWordMatchData.push({
                id: food.id,
                foodName: food.foodName,
            });
        }
    });
    return wordMatchData.concat(notWordMatchData);
}



export function getFoodDetailsById(id: string): any {
    return fetch(`${BASE_URL}/BLV-api/food/${id}?lang=${LANG}`)
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(`Errore nella richiesta: ${response.statusText}`);
            }
            const result = await response.json();
            return parseNutritionData(result);
        })
}
