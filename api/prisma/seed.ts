/**
 * Urging"s WebShop Project
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

import {PrismaClient} from "@prisma/client";
const prisma: PrismaClient = new PrismaClient();

async function main() {
    // Criar permissões
    const permissions = await prisma.permission.createMany({
        data: [
            { name: "manage_users", description: "Can manage users" },
            { name: "manage_products", description: "Can manage products" },
            { name: "view_orders", description: "Can view orders" },
            { name: "manage_orders", description: "Can manage orders" },
        ],
        skipDuplicates: true
    });

    // Criar roles
    const adminRole = await prisma.role.upsert({
        where: { name: "SUPER_ADMIN" },
        update: {},
        create: { name: "SUPER_ADMIN", label: "Super Admin" }
    });

    const customerRole = await prisma.role.upsert({
        where: { name: "CUSTOMER" },
        update: {},
        create: { name: "CUSTOMER", label: "Customer" }
    });

    // Associar permissões ao admin
    const allPermissions = await prisma.permission.findMany();
    for (const perm of allPermissions) {
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
            update: {},
            create: { roleId: adminRole.id, permissionId: perm.id }
        });
    }
}

main().then(() => {
    prisma.$disconnect();
}).catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
})