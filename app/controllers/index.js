import Ember from 'ember';

export default Ember.Controller.extend({
  inputCSV: null,
  errorMessage: null,

  actions: {
    onchange(files) {
      this.set('inputCSV', files)
    },

    uploadCSV() {
      let fileReader = new FileReader();

      fileReader.readAsText(this.get('inputCSV')[0]);
      fileReader.onload = (event) => {
        console.log(event.target.result);
      }

      fileReader.onerror = (error) => {
        if (error.target.error.name == 'NotReadableError') {
          this.set('errorMessage', error.target.error.name);
        }
      }
    }
  }
});
