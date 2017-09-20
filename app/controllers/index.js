import Ember from 'ember';

export default Ember.Controller.extend({
  inputCSV: null,

  actions: {
    uploadCSV(event) {
      let inputCSV = this.get(inputCSV);

      console.log(event);
    }
  }
});
