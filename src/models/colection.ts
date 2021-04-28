import mongoose, {Document, Schema} from "mongoose";

export interface Colection extends Document{
    name: string,
    icon: string,
    color: string,
    user: string
}
export const ColectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: { createdAt: true, updatedAt:true } }
);

ColectionSchema.virtual('id').get(function(this : Colection){
    return this._id.toHexString();
});


// Ensure virtual fields are serialised.
ColectionSchema.set('toJSON', {
    virtuals: true
});

export const ColectionModel = mongoose.model<Colection>('Colection', ColectionSchema);
