import { UserRole } from "../../types/user";
import { User } from "./user.model";

export class UserRepository {
    static async addPoints(id: string, points: number) {
        return await User.findByIdAndUpdate(id, { $inc: { points } }, { new: true });
    }

    static async becomeContributor(id: string) {
        return await User.findByIdAndUpdate(id, { role: UserRole.contributor }, { new: true });
    }
}