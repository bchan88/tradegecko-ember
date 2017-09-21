import Ember from 'ember';

const KEY_NAME_MAP = {
  customer_name: 'Name',
  customer_address: 'Address',
  status: 'Status',
  name: 'Name',
  price: 'Price',
  stock_levels: 'Stock Levels',
  ship_date: 'Ship Date',
  shipping_provider: 'Shipping Provider',
  order_id: 'Order ID',
  product_ids: 'Product IDs',
  total: 'Total'
}

export default Ember.Component.extend({
  tagName: 'tr',
  record: null,

  timestampString: Ember.computed('record.timestamp', function() {
    let timestamp = new Date(this.get('record.timestamp'));
    
    return timestamp.toString();
  }),

  changes: Ember.computed('record.changes', function() {
    let changesObject = JSON.parse(this.get('record.changes'));
    let changesArray = Object.entries(changesObject);

    return changesArray.map((change) => {
      let [key, value] = change;

      return {
        key: KEY_NAME_MAP[key],
        value
      };
    });
  })
});
