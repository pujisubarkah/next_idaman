import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
    try {
        // Fetch roles
        const { data: roles, error: rolesError } = await supabase
        .schema('siap_skpd')
            .from('roles')
            .select('id, role_name');

        if (rolesError) {
            throw new Error(`Error fetching roles: ${rolesError.message}`);
        }

        // Fetch all users (we can limit this if necessary for performance)
        const { data: users, error: usersError } = await supabase
        .schema('siap_skpd')
            .from('users')
            .select('role_id');

        if (usersError) {
            throw new Error(`Error fetching users: ${usersError.message}`);
        }

        // Group users by role_id and count them
        const userCounts = users.reduce((acc, user) => {
            acc[user.role_id] = (acc[user.role_id] || 0) + 1;
            return acc;
        }, {});

        // Merge user counts with roles
        const formattedRoles = roles.map(role => {
            const userCount = userCounts[role.id] || 0;
            return {
                id: role.id,
                name: role.role_name,
                userCount: userCount,
            };
        });

        // Send the response
        res.status(200).json(formattedRoles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
