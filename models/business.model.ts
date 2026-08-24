import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBusiness extends Document {
  ownerId: mongoose.Types.ObjectId;
  businessName: string;
  supportEmail: string;
  knowledge?: string;
  createdAt: Date;
  updatedAt: Date;
}

const businessSchema = new Schema<IBusiness>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    supportEmail: {
      type: String,
      required: true,
      trim: true,
    },

    knowledge: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Business: Model<IBusiness> =
  mongoose.models.Business ||
  mongoose.model<IBusiness>("Business", businessSchema);

export default Business;