
'use server'

import { authOptionsClient, authOptionsNutritionist } from "@/lib/auth";

export async function doClientLogin(formData : any) {
    const action = formData.get('action');
    await authOptionsClient.signIn(action, { 
      redirectTo: "/client/dashboard"
    });
}

export async function doNutritionistLogin(formData : any) {
    const action = formData.get('action');
    await authOptionsNutritionist.signIn(action, { 
      redirectTo: "/nutritionist/dashboard"
    });
}

export async function doClientLogout() {
  await authOptionsClient.signOut({ redirectTo: "/" });
}

export async function doNutritionistLogout() {
  await authOptionsNutritionist.signOut({ redirectTo: "/" });
}