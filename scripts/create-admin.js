/**
 * Script to create admin user in Supabase
 * 
 * This script creates a user in Supabase Auth and sets up their profile and admin role.
 * 
 * USAGE:
 * 1. Make sure you have the Supabase service role key (not the anon key)
 * 2. Set the SUPABASE_SERVICE_ROLE_KEY environment variable
 * 3. Run: node scripts/create-admin.js
 * 
 * Or create a .env file with:
 * SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = 'https://qtaarndtwyxdsqlkepir.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2];

if (!supabaseServiceRoleKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is required');
  console.log('\nUsage:');
  console.log('  node scripts/create-admin.js <service_role_key>');
  console.log('  OR set SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.log('\nTo get your service role key:');
  console.log('  1. Go to Supabase Dashboard');
  console.log('  2. Project Settings > API');
  console.log('  3. Copy the "service_role" key (keep this secret!)');
  process.exit(1);
}

// Create Supabase client with service role (has admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const adminEmail = 'flowravalves@gmail.com';
const adminPassword = 'noneofyourbusiness';

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');
    console.log(`   Email: ${adminEmail}`);
    
    // Step 1: Create user in Supabase Auth
    console.log('\n1️⃣ Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: 'FlowraValves Admin'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  User already exists in auth. Using existing user...');
        // Get existing user
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = existingUsers.users.find(u => u.email === adminEmail);
        if (!existingUser) {
          throw new Error('User exists but could not be found');
        }
        authData.user = existingUser;
        console.log(`   ✅ Found existing user: ${existingUser.id}`);
      } else {
        throw authError;
      }
    } else {
      console.log(`   ✅ User created: ${authData.user.id}`);
    }

    const userId = authData.user.id;

    // Step 2: Insert profile
    console.log('\n2️⃣ Creating user profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: adminEmail,
        full_name: 'FlowraValves Admin',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      throw profileError;
    }
    console.log('   ✅ Profile created');

    // Step 3: Assign admin role
    console.log('\n3️⃣ Assigning admin role...');
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'admin',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (roleError) {
      throw roleError;
    }
    console.log('   ✅ Admin role assigned');

    console.log('\n✅ Admin user setup complete!');
    console.log(`\n📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`🆔 User ID: ${userId}`);
    console.log('\nYou can now login to the admin panel with these credentials.');

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createAdminUser();

