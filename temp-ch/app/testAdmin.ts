'use server'

import { dbAdmin } from "./firebaseAdmin"

export const getData = async() => {
    try {
       const snapshot = await dbAdmin.collection('server').doc("1").get();
       if (!snapshot.exists) {
            console.log("Dokument existiert nicht!");
            return null; 
        }
       const data = {
         id: snapshot.id, 
         ...snapshot.data()
       };    
       return data;
    }catch(e) {
        console.error(e);
        throw new Error("Datenbankfehler");
    }
}