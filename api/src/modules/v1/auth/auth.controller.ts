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

import {Body, Controller, Post} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";
import {RegisterDto} from "./dto/register.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto.email, dto.firstName, dto.lastName, dto.password);
    }

    @Post("login")
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }
}
