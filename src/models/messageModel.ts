import mongoose, { Document, Schema } from "mongoose";

interface Message {
  Contenu: string;
  Logs: string;
  id_User: mongoose.Types.ObjectId;
  id_Channel: mongoose.Types.ObjectId;
}

interface MessageDocument extends Message, Document {}

const MessageSchema = new Schema<MessageDocument>(
  {
    Contenu: String,
    Logs: String,
    id_User: { type: Schema.Types.ObjectId },
    id_Channel: { type: Schema.Types.ObjectId },
  },
  { collection: "Message", versionKey: false }
);

MessageSchema.pre("save", function (next) {
  if (this.isNew) {
    this.Logs = new Date().toLocaleString();
  }
  next();
});

const MessageModel = mongoose.model("Message", MessageSchema);

export default MessageModel;
