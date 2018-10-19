// VueJS modules
import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";

import Boilerplate from "../Boilerplate";

import FirebaseSingleton from "../../services/FirebaseSingleton";

type Visit = {
  created_at: Date;
  confirmed_at: Date;
};

@Component({
  components: { Boilerplate }
})
export default class App extends Vue {
  name = "app";
  msg = "Welcome to Your Vue.js App";
  visits: Visit[] = [];
  fst: FirebaseSingleton;

  async mounted() {
    this.fst = await FirebaseSingleton.GetInstance();

    this.fst.firestore.collection("visits").onSnapshot(snapshot => {
      snapshot.docChanges.forEach(change => {
        if (change.type == "added") {
          this.visits.push(change.doc.data() as Visit);
        }
      });
    });
  }

  check_question() {

  }

  add_visit() {
    this.fst.firestore.collection("visits").add({ created_at: new Date() });
  }
}

require("./app.html")(App);
