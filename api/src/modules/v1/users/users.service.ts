/**
 * Urging's WebShop Project
 * Copyright (C) 2025 UrgingOfc
 *
 * This is a personal project developed and maintained by UrgingOfc, with the goal
 * of learning, sharing knowledge, and contributing to the developer community.
 *
 * This project is released under the MIT License.
 * You are free to use, modify, and distribute this software, provided that the
 * original copyright and license notice are included in all copies or substantial
 * portions of the software.
 *
 * No warranty is provided, and the author is not liable for any damages or issues
 * that may arise from using this software.
 *
 * Author: UrgingOfc <https://urging.ch>
 */

import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../../prisma/prisma.service";
import {Prisma, User} from "@prisma/client";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    /**
     * Returns all the users from the application
     */
    async getUsers(page: number = 1, limit: number = 10): Promise<User[]> {
        // Determines how much users we should skip
        const skip: number = (page - 1) * limit;

        // Gets all the users with their roles
        return this.prisma.user.findMany({
            skip: skip,
            take: limit,
            include: {
                role: true
            }
        });
    }

    /**
     * Return a user from the application
     * @param id {number} ID of the user
     */
    async getUser(id: number): Promise<User> {
        // Gets the user from the DB
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                role: true
            }
        });

        // Validates the user
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Returns the user
        return user;
    }

    /**
     * Updates user data to the application
     * @param id {number} ID of the user
     * @param data {Prisma.UserUpdateInput} Prisma's User Update Input
     */
    async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
        // Gets and validates the user by the ID (throws exception if don't exists)
        await this.getUser(id);

        // Updates the user if validated
        return this.prisma.user.update({
            where: {
                id: id
            },
            data
        });
    }

    /**
     * Deletes a user entirely from the application
     * @param id {number} ID of the user
     */
    async deleteUser(id: number): Promise<User> {
        // Gets and validates the user by the ID (throws exception if don't exists)
        await this.getUser(id);

        // Deletes the user if validated
        return this.prisma.user.delete({
            where: {
                id: id
            }
        });
    }
}
