import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),

  inputCSV: null,
  errorMessage: null,
  searchResults: null,
  searchId: null,
  searchType: null,
  searchTimestamp: null,
  didMakeSearch: false,
  isShowingSuccess: false,

  init() {
    this._super(...arguments);

    this.set('searchResults', []);
  },

  actions: {
    onchange(files) {
      this.set('inputCSV', files)
    },

    uploadCSV() {
      let inputCSV = this.get('inputCSV');

      if (!inputCSV || inputCSV.length === 0) {
        return;
      }

      let fileReader = new FileReader();
      fileReader.readAsText(inputCSV[0]);
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
      this.set('didMakeSearch', true);

      let filter = {};
      let searchId = this.get('searchId');
      let searchType = this.get('searchType');
      let searchTimestamp = this.get('searchTimestamp');

      if (searchId) {
        filter.objectId = parseInt(searchId);
      }
      if (searchType) {
        filter.objectType = searchType;
      }
      if (searchTimestamp) {
        let timestamp = new Date(searchTimestamp);
        filter.timestamp = timestamp.getTime();
      }

      this.get('store').query('record', { filter }).then((records) => {
        this.set('searchResults', records);
      });
    }
  },

  _parseCSV(csv) {
    let rows = csv.split('\n');

    if (rows[0].includes('object_id')) {
      rows = rows.slice(1);
    }

    rows.forEach((row) => {
      let rowArray = row.split(',', 3);
      let startOfChanges = row.indexOf('"');
      let changesString = JSON.parse(row.substr(startOfChanges));

      let record = this.get('store').createRecord('record', {
        objectId: parseInt(rowArray[0]),
        objectType: rowArray[1],
        timestamp: parseInt(rowArray[2]) * 1000,
        changes: changesString
      });

      record.save();
    });

    this.set('errorMessage', null);
    this.set('isShowingSuccess', true);
    setTimeout(() => this.set('isShowingSuccess', false), 2000);
  }
});
