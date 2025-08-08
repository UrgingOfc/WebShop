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

import {Injectable, OnModuleInit, OnModuleDestroy} from "@nestjs/common";
import {PrismaClient} from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        // Connects to the PrismaClient
        await this.$connect();
    }

    async onModuleDestroy() {
        // Disconnects from the PrismaClient
        await this.$disconnect();
    }
}