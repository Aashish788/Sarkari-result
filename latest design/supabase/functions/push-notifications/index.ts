import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { method, url } = req;
    const pathname = new URL(url).pathname;

    // Route handling
    if (method === 'POST' && pathname === '/push-notifications/send') {
      return await handleSendNotification(req, supabaseClient);
    } else if (method === 'POST' && pathname === '/push-notifications/subscribe') {
      return await handleSubscribe(req, supabaseClient);
    } else if (method === 'DELETE' && pathname === '/push-notifications/unsubscribe') {
      return await handleUnsubscribe(req, supabaseClient);
    } else if (method === 'PUT' && pathname === '/push-notifications/preferences') {
      return await handleUpdatePreferences(req, supabaseClient);
    } else if (method === 'GET' && pathname === '/push-notifications/stats') {
      return await handleGetStats(req, supabaseClient);
    } else if (method === 'POST' && pathname === '/push-notifications/test') {
      return await handleTestNotification(req, supabaseClient);
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in push-notifications function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleSendNotification(req: Request, supabaseClient: any) {
  const { title, body, category, icon, badge, image, data, url } = await req.json();

  if (!title || !body || !category) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: title, body, category' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Call the database function to create notification and get delivery list
    const { data: notificationId, error } = await supabaseClient
      .rpc('send_push_notification', {
        p_title: title,
        p_body: body,
        p_category: category,
        p_icon: icon || '/icons/icon-192x192.png',
        p_badge: badge || '/icons/icon-96x96.png',
        p_image: image,
        p_data: data || {},
        p_url: url || '/'
      });

    if (error) {
      throw error;
    }

    // Get pending deliveries for this notification
    const { data: deliveries, error: deliveryError } = await supabaseClient
      .from('push_delivery_log')
      .select(`
        id,
        push_subscriptions!inner(endpoint, p256dh, auth)
      `)
      .eq('notification_id', notificationId)
      .eq('status', 'pending');

    if (deliveryError) {
      throw deliveryError;
    }

    // Get VAPID keys
    const { data: vapidData, error: vapidError } = await supabaseClient
      .from('vapid_keys')
      .select('public_key, private_key, subject')
      .eq('id', 1)
      .single();

    if (vapidError) {
      throw vapidError;
    }

    // Send push notifications
    const results = await sendPushNotifications(deliveries, {
      title,
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: badge || '/icons/icon-96x96.png',
      image,
      data: { ...data, url: url || '/' }
    }, vapidData, supabaseClient);

    return new Response(
      JSON.stringify({
        success: true,
        notificationId,
        totalRecipients: deliveries.length,
        sent: results.successful,
        failed: results.failed
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send notification', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function sendPushNotifications(deliveries: any[], payload: any, vapidKeys: any, supabaseClient: any) {
  const webPush = await import('https://esm.sh/web-push@3.6.6');
  
  webPush.setVapidDetails(
    vapidKeys.subject,
    vapidKeys.public_key,
    vapidKeys.private_key
  );

  let successful = 0;
  let failed = 0;

  for (const delivery of deliveries) {
    try {
      const subscription = {
        endpoint: delivery.push_subscriptions.endpoint,
        keys: {
          p256dh: delivery.push_subscriptions.p256dh,
          auth: delivery.push_subscriptions.auth
        }
      };

      await webPush.sendNotification(subscription, JSON.stringify(payload));
      
      // Update delivery status to sent
      await supabaseClient
        .from('push_delivery_log')
        .update({ 
          status: 'sent', 
          delivered_at: new Date().toISOString(),
          response_data: { success: true }
        })
        .eq('id', delivery.id);

      successful++;

    } catch (error) {
      console.error('Failed to send to subscription:', error);
      
      // Update delivery status to failed
      await supabaseClient
        .from('push_delivery_log')
        .update({ 
          status: 'failed', 
          error_message: error.message,
          response_data: { error: error.message }
        })
        .eq('id', delivery.id);

      // If subscription is expired/invalid, mark as expired
      if (error.statusCode === 410 || error.statusCode === 404) {
        await supabaseClient
          .from('push_subscriptions')
          .update({ is_active: false })
          .eq('endpoint', delivery.push_subscriptions.endpoint);
      }

      failed++;
    }
  }

  // Update notification counts
  await supabaseClient
    .from('push_notifications')
    .update({ 
      success_count: successful,
      failure_count: failed
    })
    .eq('id', deliveries[0]?.notification_id);

  return { successful, failed };
}

async function handleSubscribe(req: Request, supabaseClient: any) {
  const { endpoint, p256dh, auth, preferences, userAgent, ipAddress } = await req.json();

  if (!endpoint || !p256dh || !auth) {
    return new Response(
      JSON.stringify({ error: 'Missing required subscription data' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { data, error } = await supabaseClient
      .from('push_subscriptions')
      .upsert({
        endpoint,
        p256dh,
        auth,
        preferences: preferences || {
          newJobs: true,
          results: true,
          admitCards: true,
          answerKeys: true,
          generalUpdates: false
        },
        user_agent: userAgent,
        ip_address: ipAddress,
        is_active: true
      }, { 
        onConflict: 'endpoint',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, subscription: data[0] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error subscribing:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to subscribe', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleUnsubscribe(req: Request, supabaseClient: any) {
  const { endpoint } = await req.json();

  if (!endpoint) {
    return new Response(
      JSON.stringify({ error: 'Missing endpoint' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { error } = await supabaseClient
      .from('push_subscriptions')
      .update({ is_active: false })
      .eq('endpoint', endpoint);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error unsubscribing:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to unsubscribe', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleUpdatePreferences(req: Request, supabaseClient: any) {
  const { endpoint, preferences } = await req.json();

  if (!endpoint || !preferences) {
    return new Response(
      JSON.stringify({ error: 'Missing endpoint or preferences' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { error } = await supabaseClient
      .from('push_subscriptions')
      .update({ preferences })
      .eq('endpoint', endpoint);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating preferences:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update preferences', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleGetStats(req: Request, supabaseClient: any) {
  try {
    const { data: stats, error } = await supabaseClient
      .rpc('get_push_subscription_stats');

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, stats: stats[0] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error getting stats:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get stats', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleTestNotification(req: Request, supabaseClient: any) {
  const { endpoint } = await req.json();

  if (!endpoint) {
    return new Response(
      JSON.stringify({ error: 'Missing endpoint for test' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get subscription details
    const { data: subscription, error: subError } = await supabaseClient
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth')
      .eq('endpoint', endpoint)
      .eq('is_active', true)
      .single();

    if (subError || !subscription) {
      throw new Error('Subscription not found or inactive');
    }

    // Get VAPID keys
    const { data: vapidData, error: vapidError } = await supabaseClient
      .from('vapid_keys')
      .select('public_key, private_key, subject')
      .eq('id', 1)
      .single();

    if (vapidError) {
      throw vapidError;
    }

    // Send test notification
    const webPush = await import('https://esm.sh/web-push@3.6.6');
    
    webPush.setVapidDetails(
      vapidData.subject,
      vapidData.public_key,
      vapidData.private_key
    );

    const testPayload = {
      title: 'Test Notification',
      body: 'This is a test notification from Sarkari Result PWA!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      data: { url: '/', test: true }
    };

    const subscriptionObject = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      }
    };

    await webPush.sendNotification(subscriptionObject, JSON.stringify(testPayload));

    return new Response(
      JSON.stringify({ success: true, message: 'Test notification sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending test notification:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send test notification', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
} 