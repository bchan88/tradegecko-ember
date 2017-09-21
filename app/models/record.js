import DS from 'ember-data';

export default DS.Model.extend({
  objectId: DS.attr('number'),
  objectType: DS.attr('string'),
  timestamp: DS.attr('number'),
  changes: DS.attr('string')
});
