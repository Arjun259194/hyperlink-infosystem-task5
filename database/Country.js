// models/Country.js
import { Schema, model } from 'mongoose';

const countrySchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  nationality: { type: String, default: '' },
  sortname: { type: String, default: '' },
  calling_code: { type: String, default: '' },
  currency_code: { type: String, default: '' },
  currency_name: { type: String, default: '' },
  currency_symbol: { type: String, default: '' },
  status: { type: Number, default: 1 },
}, {
  timestamps: true // optional: adds createdAt and updatedAt fields
});

const Country = model('Country', countrySchema);

export default Country;
