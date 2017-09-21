import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),

  inputCSV: null,
  errorMessage: null,
  searchResults: null,
  searchId: null,
  searchType: null,
  searchTimestamp: null,

  init() {
    this._super(...arguments);

    this.set('searchResults', []);
  },

  actions: {
    onchange(files) {
      this.set('inputCSV', files)
    },

    uploadCSV() {
      let fileReader = new FileReader();

      fileReader.readAsText(this.get('inputCSV')[0]);
      fileReader.onload = (event) => {
        try {
          this._parseCSV(event.target.result);
        } catch (e) {
          this.set('errorMessage', e)
        }
      }

      fileReader.onerror = (error) => {
        if (error.target.error.name == 'NotReadableError') {
          this.set('errorMessage', error.target.error.name);
        }
      }
    },

    submitSearch() {
      let filter = {};
      let searchId = this.get('searchId');
      let searchType = this.get('searchType');
      let searchTimestamp = this.get('searchTimestamp');

      if (searchId) {
        filter._id = parseInt(searchId);
      }
      if (searchType) {
        filter.type = searchType;
      }
      if (searchTimestamp) {
        filter.timestamp = new Date(searchTimestamp);
      }
      console.log(filter);
      this.get('store').query('record', { filter }).then((records) => {
        this.set('searchResults', records);
      });
    }
  },

  _parseCSV(csv) {
    let rows = csv.split('\n');
    rows.forEach((row) => {
      let rowArray = row.split(',', 3);
      let startOfChanges = row.indexOf('"');
      let changesString = JSON.parse(row.substr(startOfChanges));

      let record = this.get('store').createRecord('record', {
        _id: parseInt(rowArray[0]),
        type: rowArray[1],
        timestamp: new Date(parseInt(rowArray[2]) * 1000),
        changes: changesString
      });

      record.save();
    });
  }
});
