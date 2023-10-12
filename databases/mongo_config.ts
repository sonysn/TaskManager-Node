import mongoose, { Mongoose } from 'mongoose';

async function mongoConnect() {
  try {
        await mongoose.connect(process.env.MONGODB_LOCAL_URL as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as any);
        console.log('Connected to MongoDB!');
        return mongoose;
    } catch (err) {
        console.error(`'Error connecting to MongoDB: ${err}`);
        throw err;
    }
}

export { mongoConnect };
