"use server"

import { dbAdmin } from "../config/firebaseServer";

export const addUser = async (uid: string, email: string | null ) => {
  try {
      const userRef = dbAdmin.collection("users").doc(uid);
    const doc = await userRef.get();

  
    if (!doc.exists) {
        await userRef.set({
            email: email,
            role: "user", 
            createdAt: new Date().toISOString()
        });
        console.log("Neuer User in Firestore angelegt:", email);
       
      } else {
        console.log("User existiert bereits, Daten bleiben erhalten:", email);
    
      }
      return {success:true};
  }catch(e) {
    console.error(e);
    return {success: false};
  }
   
};