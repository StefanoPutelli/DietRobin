import connectDB from "@/lib/connectDB";
import Client from "@/models/Users/Client";
import Nutritionist from "@/models/Users/Nutritionist";
import Diet from "@/models/Diet/Diet";
import path from "path";

export type UserRole = "client" | "nutritionist";

function checkParams(params: any[]) {
    params.forEach((param) => {
        if (param === null || param === undefined) {
            return false;
        }
    });
    return true;
}

export async function createClientUser(mail: string | null | undefined, name: string | null | undefined) {
    try {
        if (!checkParams([mail, name])) {
            return { error: "missing parameters" };
        }
        await connectDB();
        const existingUser = await Client.findOne({ mail: mail });
        if (existingUser) {
            return existingUser;
        }
        const newUser = new Client({
            name: name,
            mail: mail
        });
        await newUser.save();
        return newUser;
    } catch (e) {
        return { error: e };
    }
}

export async function createNutritionistUser(mail: string | null | undefined, name: string | null | undefined) {
    try {
        if (!checkParams([mail, name])) {
            return { error: "missing parameters" };
        }
        await connectDB();
        const existingUser = await Nutritionist.findOne({ mail: mail });
        if (existingUser) {
            return existingUser;
        }
        const newUser = new Nutritionist({
            name: name,
            mail: mail
        });
        await newUser.save();
        return newUser;
    } catch (e) {
        return { error: e };
    }
}

export async function getUserRole(mail: string | null | undefined) {
    try {
        await connectDB();
        const clientUser = await Client.findOne({ mail: mail });
        if (clientUser) {
            return "client" as UserRole;
        }
        const nutritionistUser = await Nutritionist.findOne({ mail: mail });
        if (nutritionistUser) {
            return "nutritionist" as UserRole;
        }
        return { error: "user not found" };
    } catch (e) {
        return { error: "db error" };
    }
}

export async function getClientUserInfo(id: number) {
    try {
        await connectDB();
        const userInfo = await Client.findOne({
            id: id
        });
        return userInfo;
    } catch (e) {
        return { error: "db error" };
    }
}

export async function getClientUserInfoByEmail(email: string) {
    try {
        await connectDB();
        const userInfo = await Client.findOne({
            mail: email
        });
        return userInfo;
    } catch (e) {
        return { error: "db error" };
    }
}

export async function deleteClientUser(id: number) {
    try {
        await connectDB();
        const userInfo = await Client.deleteOne({
            id: id
        });
        return userInfo;
    } catch (e) {
        return { error: "db error" };
    }
}

export async function getNutritionistUserInfo(id: string) {
    try {
        await connectDB();
        const userInfo = await Nutritionist.findOne({
            _id: id
        });
        return userInfo;
    } catch (e) {
        return { error: e };
    }
}

export async function getNutritionistClientAndDietInfo(id: string) {
    try {
        await connectDB();
        const userInfo = await Nutritionist.findOne({
            _id: id
        }).populate({
            path: 'clients',
            populate: {
                path: 'diet'
            }
        }).populate({
            path: 'clients.diet',
            populate: {
                path: 'meals'
            }
        });
        return userInfo;
    } catch (e) {
        return { error: e };
    }
}

export async function getNutritionistUserInfoByEmail(email: string) {
    try {
        await connectDB();
        const userInfo = await Nutritionist.findOne({
            mail: email
        });
        return userInfo;
    } catch (e) {
        return { error: e };
    }
}

export async function deleteNutritionistUser(id: number) {
    try {
        await connectDB();
        const userInfo = await Nutritionist.deleteOne({
            id: id
        });
        return userInfo;
    } catch (e) {
        return { error: "db error" };
    }
}

export async function addClientToNutritionist(nutritionistId: string, client: any) {
    try {
        await connectDB();
        const nutritionist = await Nutritionist.findOne({
            _id: nutritionistId
        });
        if (!nutritionist) {
            return { error: "nutritionist not found" };
        }
        nutritionist.clients.push(client);
        await nutritionist.save();
        return nutritionist;
    } catch (e) {
        return { error: "db error" };
    }
}

export async function addDietToClient(clientId: number, dietName: string, start: Date, end: Date) {
    try {
        await connectDB();
        const client = await Client.findOne({
            _id: clientId
        });
        if (!client) {
            return { error: "client not found" };
        }
        const diet = new Diet({
            name: dietName,
            start: start,
            end: end
        });
        await diet.save();
        client.diet.push(diet);
        await client.save();
        return diet;
    } catch (e) {
        return { error: "db error" };
    }
}

export async function deleteDietToClient(clientId: string, dietId: string) {
    try {
        await connectDB();
        const client = await Client.findOne({
            _id: clientId
        });
        const diet = await Diet.deleteOne({
            _id: dietId
        });
        if (!diet) {
            return { error: "diet not found" };
        }
        if (!client) {
            return { error: "client not found" };
        }
        client.diet = client.diet.filter((diet: any) => {
            diet.equals(dietId)
        });
        await client.save();
        return client;
    } catch (e) {
        return { error: "db error" };
    }
}

export async function DeleteClientFromNutritionist(nutritionistId: string, clientId: string) {
    try {
        await connectDB();
        const nutritionist = await Nutritionist.findOne({
            _id: nutritionistId
        });
        if (!nutritionist) {
            return { error: "nutritionist not found" };
        }
        nutritionist.clients = nutritionist.clients.filter((client: any) => {
            client.equals(clientId)
        });
        await nutritionist.save();
        return nutritionist;
    } catch (e) {
        return { error: "db error" };
    }
}