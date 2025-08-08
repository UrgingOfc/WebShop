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

import {Injectable, CanActivate, ExecutionContext, ForbiddenException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    /**
     * Checks if the user has the required roles to access
     * a certain API level on the application.
     * @param context {ExecutionContext} An execution context
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Gets the required roles to perform the action
        const requiredRoles: string[] = this.reflector.get<string[]>("roles", context.getHandler());

        // Validates if this action has roles required
        if (!requiredRoles) {
            return true;
        }

        // Gets the actual user trying to access the API
        const {user} = context.switchToHttp().getRequest();

        // Validates that the user has the required roles of this action
        if (!requiredRoles.includes(user.role.name)) {
            throw new ForbiddenException("You don't have sufficient permissions to perform this action");
        }

        // Allows the action if the user has the role
        return true;
    }
}