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

import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import {PrismaService} from "../../../prisma/prisma.service";
import {UserPayload} from "../../../types";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    /**
     * Registers a new user to the application.
     * @param email {string} E-mail of the person
     * @param firstName {string} First name of the person
     * @param lastName {string} Last name of the person
     * @param password {string} Password of the person
     */
    async register(email: string, firstName: string, lastName: string, password: string) {
        // Hashes the password of the user
        const hashedPassword: string = await bcrypt.hash(password, 12);

        // Initializes the new user to the DB
        const user = await this.prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                role: {
                    connect: {
                        name: "CUSTOMER"
                    }
                }
            },
            include: {
                role: true
            }
        });

        // Returns the JWT token of the user
        return this.generateToken(user);
    }

    /**
     * Logs in a user with his credentials
     * @param email {string} E-Mail of the person
     * @param password {string} Password of the person
     */
    async login(email: string, password: string) {
        // Searches for the person on the DB
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                role: {
                    include: {
                        rolePermissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        });

        // Validates the user
        if (!user) {
            throw new NotFoundException("Invalid User");
        }

        // Validates the user password
        if (!(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException("Invalid Credentials");
        }

        // Returns the JWT token
        return this.generateToken(user);
    }

    /**
     *
     * @param user
     * @private
     */
    private async generateToken(user) {
        const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role.name,
            permissions: user.role.permissions.map(permission => permission.name)
        };

        return {
            token: this.jwtService.sign(payload)
        }
    }
}
