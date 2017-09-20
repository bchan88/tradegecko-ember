import DS from 'ember-data';

export default DS.Model.extend({
  id: DS.attr('int'),
  type: DS.attr('string'),
  time: DS.attr('date'),
  changes: DS.attr('string')
});
