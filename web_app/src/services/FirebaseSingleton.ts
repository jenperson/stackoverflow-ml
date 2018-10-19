let singleton: FirebaseSingleton;

// Typings for modules imported dynamically
import FirebaseAppModule = require("firebase/app");

export default class FirebaseSingleton {
  firestore: FirebaseAppModule.firestore.Firestore;

  required = {
    firebase: FirebaseAppModule
  };

  async init() {
    await Promise.all([
      System.import("firebase"),
      System.import("isomorphic-fetch")
    ]);

    this.required.firebase = <typeof FirebaseAppModule>require("firebase/app");
    require("firebase/firestore");
    require("isomorphic-fetch");

    const config = await fetch("/__/firebase/init.json").then(response =>
      response.json()
    );

    this.required.firebase.initializeApp(config);

    this.firestore = this.required.firebase.firestore();
  }

  public static async GetInstance() {
    if (!singleton) {
      singleton = new FirebaseSingleton();
      await singleton.init();
    }

    return singleton;
  }
}
