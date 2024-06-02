import { UserRepository } from "./user.repository";

export class UserService {
    static async addPoints(id: string, points: number) {
        return await UserRepository.addPoints(id, points);
    }

    static async becomeContributor(id: string) {
        return await UserRepository.becomeContributor(id);
    }
}