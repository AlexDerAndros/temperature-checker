'use server';

import { dbAdmin } from "../config/firebaseServer";

export const getRole = async(email:string): Promise<string> => {
    try {
        const snapshot = await dbAdmin.collection("users").doc(email).get()
        const user = snapshot.data();
        return user?.role || "Error";
    } catch(e) {
        console.error(e);
        return "Error";
    }
}