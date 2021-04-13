import { createSchema, Type, typedModel, ExtractDoc, ExtractProps } from 'ts-mongoose';
import {UserSchema} from "./user";

export const ColectionSchema = createSchema(
    {
        name: Type.string({required: true}),
        icon: Type.string({required: true}),
        color: Type.string({required: true}),
        user: Type.ref(Type.objectId({required: true})).to('User', UserSchema)
    },
    { timestamps: { createdAt: true, updatedAt:true } }
);

ColectionSchema.virtual('id').get(function(this : ColectionDoc){
    return this._id.toHexString();
});


// Ensure virtual fields are serialised.
ColectionSchema.set('toJSON', {
    virtuals: true
});

export const Colection = typedModel('Colection', ColectionSchema);
export type ColectionDoc = ExtractDoc<typeof ColectionSchema>;
export type ColectionProps = ExtractProps<typeof ColectionSchema>;

