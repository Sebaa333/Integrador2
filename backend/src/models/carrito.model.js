import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    nombre: { type: String, required: [true, 'Cada item necesita un nombre'], trim: true },
    precio: { type: Number, required: [true, 'Cada item necesita un precio'], min: 0 },
    cantidad: {
      type: Number,
      required: [true, 'Cada item necesita una cantidad'],
      min: [1, 'La cantidad mínima es 1'],
      validate: { validator: Number.isInteger, message: 'La cantidad debe ser un número entero' },
    },
  },
  { _id: false }
);

const carritoSchema = new mongoose.Schema(
  {
    items: {
      type: [itemSchema],
      validate: { validator: (items) => items.length > 0, message: 'El carrito no puede estar vacío' },
    },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

carritoSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export default mongoose.model('Carrito', carritoSchema);
