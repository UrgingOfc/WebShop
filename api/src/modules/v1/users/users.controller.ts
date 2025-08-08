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

import {Controller, Get, Param, ParseIntPipe, Put, Delete, Body, UseGuards, ValidationPipe, Query} from "@nestjs/common";
import {UsersService} from "./users.service";
import {UpdateUserDto} from "./dto/update-user.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RolesGuard} from "../../../common/guards/roles.guard";
import {PermissionsGuard} from "../../../common/guards/permissions.guard";
import {Permissions} from "../../../common/decorators/users.decorator";

@Controller({
    path: "users",
    version: "1"
})
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Permissions("MANAGE_USERS")
    getUsers(@Query("page", ParseIntPipe) page: number = 1, @Query("limit", ParseIntPipe) limit: number = 10) {
        return this.usersService.getUsers(page, limit);
    }

    @Get(":id")
    @Permissions("MANAGE_USERS")
    getUser(@Param(":id", ParseIntPipe) id: number) {
        return this.usersService.getUser(id);
    }

    @Put(":id")
    @Permissions("MANAGE_USERS")
    updateUser(@Param(":id", ParseIntPipe) id: number, @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) data: UpdateUserDto) {
        return this.usersService.updateUser(id, data);
    }

    @Delete(":id")
    @Permissions("MANAGE_USERS")
    deleteUser(@Param(":id", ParseIntPipe) id: number) {
        return this.usersService.deleteUser(id);
    }
}
