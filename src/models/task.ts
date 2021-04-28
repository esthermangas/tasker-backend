import mongoose, {Document, Schema} from "mongoose";

export interface Task extends Document{
    description: string,
    done: boolean,
    date: Date,
    colection: string,
    user: string
}
export const TaskSchema =new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        done: {
            type: Boolean,
            required: true,
            default: false
        },
        date: {
            type: Date,
            required: true
        },
        colection: { type: Schema.Types.ObjectId, ref: 'Colection', required: true },
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true }

    },
    { timestamps: { createdAt: true, updatedAt:true } }
);

TaskSchema.virtual('id').get(function(this : Task){
    return this._id.toHexString();
});


// Ensure virtual fields are serialised.
TaskSchema.set('toJSON', {
    virtuals: true
});

export const TaskModel = mongoose.model<Task>('Task', TaskSchema);

