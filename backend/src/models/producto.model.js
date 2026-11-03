import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [60, 'El nombre no puede superar los 60 caracteres'],
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'El stock no puede ser negativo'],
      validate: { validator: Number.isInteger, message: 'El stock debe ser un número entero' },
    },
    marca: { type: String, trim: true, maxlength: 40 },
    categoria: { type: String, trim: true, maxlength: 50 },
    descripcionCorta: { type: String, trim: true, maxlength: 80 },
    descripcionLarga: { type: String, trim: true, maxlength: 2000 },
    edadDesde: { type: Number, min: 0, max: 100 },
    edadHasta: { type: Number, min: 0, max: 100 },
    envio: { type: Boolean, default: false },
    foto: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false }
);

// Expose "id" instead of "_id" in JSON responses (friendlier for the frontend).
productoSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export default mongoose.model('Producto', productoSchema);
