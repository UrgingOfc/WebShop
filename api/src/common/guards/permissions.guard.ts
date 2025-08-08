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
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    /**
     * Checks if the user has the required permissions to access
     * a certain API level on the application.
     * @param context {ExecutionContext} An execution context
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Gets the required permissions to perform the action
        const requiredPermissions: string[] = this.reflector.get<string[]>("permissions", context.getHandler());

        // Validates if this action has permissions required
        if (!requiredPermissions) {
            return true;
        }

        // Gets the actual user trying to access the API
        const {user} = context.switchToHttp().getRequest();

        // Gets the users permissions from his role
        const userPermissions = user.role.permissions.map(permission => permission.name);

        // Validates that the user has the required roles of this action
        if (!requiredPermissions.every(permission => userPermissions.includes(permission))) {
            throw new ForbiddenException("You don't have sufficient permissions to perform this action");
        }

        // Allows the action if the user has the role
        return true;
    }
}