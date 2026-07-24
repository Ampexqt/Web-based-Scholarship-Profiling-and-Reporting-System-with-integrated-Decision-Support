const db = require('../config/db');

const checkHealth = async (req, res, next) => {
  try {
    // Simple DB query to verify connection using Prisma
    await db.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: 'Server and Prisma Database connection are healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkHealth
};
