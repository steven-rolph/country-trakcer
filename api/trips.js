import { createClient } from 'redis';

let redisClient = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });
    
    await redisClient.connect();
  }
  return redisClient;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await getRedisClient();
    
    switch (req.method) {
      case 'GET':
        return handleGet(client, req, res);
      case 'POST':
        return handlePost(client, req, res);
      case 'DELETE':
        return handleDelete(client, req, res);
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Redis operation failed:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

async function handleGet(client, req, res) {
  const { action } = req.query;
  
  switch (action) {
    case 'load':
      const tripsData = await client.get('country-tracker:trips');
      const lastUpdated = await client.get('country-tracker:lastUpdated');
      
      res.status(200).json({
        trips: tripsData ? JSON.parse(tripsData) : [],
        lastUpdated: lastUpdated || new Date().toISOString(),
        status: 'connected'
      });
      break;
      
    case 'activity':
      const activity = await client.get('country-tracker:activity');
      res.status(200).json({
        activity: activity ? JSON.parse(activity) : []
      });
      break;
      
    default:
      res.status(400).json({ error: 'Invalid action' });
  }
}

async function handlePost(client, req, res) {
  const { action, trips, activity } = req.body;
  
  switch (action) {
    case 'save':
      if (!trips) {
        return res.status(400).json({ error: 'Trips data required' });
      }
      
      const timestamp = new Date().toISOString();
      await client.set('country-tracker:trips', JSON.stringify(trips));
      await client.set('country-tracker:lastUpdated', timestamp);
      
      res.status(200).json({ 
        status: 'connected',
        lastUpdated: timestamp 
      });
      break;
      
    case 'log-activity':
      if (!activity) {
        return res.status(400).json({ error: 'Activity data required' });
      }
      
      const existingActivity = await client.get('country-tracker:activity');
      const activities = existingActivity ? JSON.parse(existingActivity) : [];
      activities.push({
        timestamp: new Date().toISOString(),
        ...activity
      });
      
      // Keep only last 100 activities
      const recentActivities = activities.slice(-100);
      await client.set('country-tracker:activity', JSON.stringify(recentActivities));
      
      res.status(200).json({ status: 'connected' });
      break;
      
    default:
      res.status(400).json({ error: 'Invalid action' });
  }
}

async function handleDelete(client, req, res) {
  const { action } = req.query;
  
  switch (action) {
    case 'clear-all':
      const { adminPassword } = req.body;
      
      // Validate admin password if provided
      if (adminPassword !== undefined && adminPassword !== process.env.ADMIN_DELETE_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized: Invalid admin password' });
      }
      
      await client.del('country-tracker:trips');
      await client.del('country-tracker:lastUpdated');
      await client.del('country-tracker:activity');
      
      res.status(200).json({ status: 'connected' });
      break;
      
    default:
      res.status(400).json({ error: 'Invalid action' });
  }
}