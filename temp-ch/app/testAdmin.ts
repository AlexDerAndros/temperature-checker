'use server'

import { error } from "console";
import { dbAdmin } from "./firebaseAdmin"

export const getData = async() => {
    try {
       const snapshot = await dbAdmin.collection('server').get();
       if (snapshot.empty) {
            console.log("Dokument existiert nicht!");
            return []; 
        }
       const data = snapshot.docs.map((doc) => ({
         id: doc.id, ...doc.data()
       }));    
       return data;
    }catch(e) {
        console.error(e);
        throw new Error("Datenbankfehler");
    }
}

export const addData = async() => {
   try {
      const docRef = await dbAdmin.collection("server").add({
        hallo: "penis"
      });
      return{success: true, id:docRef.id};
   }catch(e) {
     console.error(e);
      return{success: false, error:"Fehler"};
   }
}
