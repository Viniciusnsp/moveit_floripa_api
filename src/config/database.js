module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'trail_app',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
