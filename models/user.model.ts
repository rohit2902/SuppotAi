import mongoose, { models } from "mongoose"
import bcrypt from "bcryptjs";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema <IUser>({
    
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
     
  },
 
  {
    timestamps: true,
  
})

userSchema.pre("save",async function (){
  if(!this.isModified("password")) return ;
  
  this.password = await bcrypt.hash(this.password, 10)
})
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = models.User || mongoose.model("User", userSchema);

export default User;