import { createSchema, Type, typedModel, ExtractDoc, ExtractProps } from 'ts-mongoose';
import {ColectionSchema} from "./colection";
import {UserSchema} from "./user";

export const TaskSchema = createSchema(
    {
        description: Type.string({required: true}),
        done: Type.boolean({required: true}),
        date: Type.date({required: true}),
        colection: Type.ref(Type.objectId({required: true})).to('Colection', ColectionSchema),
        user: Type.ref(Type.objectId({required: true})).to('User', UserSchema)
    },
    { timestamps: { createdAt: true, updatedAt:true } }
);

TaskSchema.virtual('id').get(function(this : TaskDoc){
    return this._id.toHexString();
});


// Ensure virtual fields are serialised.
TaskSchema.set('toJSON', {
    virtuals: true
});

export const Task = typedModel('Task', TaskSchema);
export type TaskDoc = ExtractDoc<typeof TaskSchema>;
export type TaskProps = ExtractProps<typeof TaskSchema>;

