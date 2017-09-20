import DS from 'ember-data';

export default DS.Model.extend({
  _id: DS.attr('number'),
  type: DS.attr('string'),
  time: DS.attr('date'),
  changes: DS.attr('string')
});
