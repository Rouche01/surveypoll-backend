import mongoose from "mongoose";

interface ResponseAttrs {
  response: string;
  createdDate: number;
}

interface ResponseDoc extends mongoose.Document {
  response: string;
  createdDate: number;
}

interface ResponseModel extends mongoose.Model<ResponseAttrs> {
  build(attrs: ResponseAttrs): ResponseDoc;
}

const responseSchema = new mongoose.Schema<ResponseAttrs>(
  {
    response: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Number,
      default: Date.now,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: (_, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

responseSchema.statics.build = (attrs: ResponseAttrs) => {
  return new Response(attrs);
};

const Response = mongoose.model<ResponseAttrs, ResponseModel>(
  "Response",
  responseSchema
);

export { Response };
