// VueJS modules
import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";

@Component
export default class Boilerplate extends Vue {
  name = "Boilerplate";

  async mounted() {}
}

require("./boilerplate.html")(Boilerplate);
