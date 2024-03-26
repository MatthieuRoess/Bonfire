import { ObjectId } from "mongodb";
import mongoose, { Document, Schema } from "mongoose";

interface Channel {
  Name: string;
  id_user: Array<ObjectId>;
}

interface ChannelDocument extends Channel, Document {}

const ChannelSchema = new Schema<ChannelDocument>(
  {
    Name: String,
    id_user: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { collection: "Channel", versionKey: false }
);

const ChannelModel = mongoose.model("Channel", ChannelSchema);

export default ChannelModel;
